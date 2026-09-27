$base = "http://localhost:5000/api"
$script:pass = 0; $script:fail = 0

function Check {
  param([string]$Name, [scriptblock]$Block, [int]$Expected = 200)
  $code = 0; $body = $null
  try {
    $r = & $Block
    $code = $r.StatusCode
    $body = $r.Content | ConvertFrom-Json
  } catch {
    $code = [int]$_.Exception.Response.StatusCode.value__
    try { $body = $_.ErrorDetails.Message | ConvertFrom-Json } catch { $body = $null }
  }
  if ($code -eq $Expected) {
    $script:pass++
    Write-Host "  PASS  $Name ($code)"
  } else {
    $script:fail++
    Write-Host "  FAIL  $Name -> got $code, expected $Expected"
    if ($body) { Write-Host "        $($body.message)" }
  }
  return $body
}

function Assert {
  param([string]$Name, [bool]$Condition, [string]$Detail = "")
  if ($Condition) {
    $script:pass++
    Write-Host "  PASS  $Name"
  } else {
    $script:fail++
    Write-Host "  FAIL  $Name"
    if ($Detail) { Write-Host "        $Detail" }
  }
}

function Info($msg) { Write-Host "        $msg" }

Write-Host "=== 1. Logins ==="
$adminLogin = Check "admin login" { Invoke-WebRequest -UseBasicParsing "$base/auth/login" -Method Post -ContentType 'application/json' -Body (@{ email='admin@gmail.com'; password='123456' } | ConvertTo-Json) }
$adminToken = $adminLogin.token
$stuLogin = Check "student login (active)" { Invoke-WebRequest -UseBasicParsing "$base/auth/login" -Method Post -ContentType 'application/json' -Body (@{ email='debjit.banerjee@campus.edu'; password='password123' } | ConvertTo-Json) }
$stuToken = $stuLogin.token
$stuId = $stuLogin.user.id
Check "pending student login -> 403" { Invoke-WebRequest -UseBasicParsing "$base/auth/login" -Method Post -ContentType 'application/json' -Body (@{ email='kavya.iyer@campus.edu'; password='password123' } | ConvertTo-Json) } 403 | Out-Null

Write-Host "=== 2. Signup creates PENDING, no token ==="
$newEmail = "smoke.$([guid]::NewGuid().ToString('N').Substring(0,8))@campus.edu"
$reg = Check "signup" { Invoke-WebRequest -UseBasicParsing "$base/auth/register" -Method Post -ContentType 'application/json' -Body (@{ name='Smoke Approve'; email=$newEmail; password='password123'; studentId='CSE-99-1'; department='Computer Science & Engineering'; year='3rd Year' } | ConvertTo-Json) } 201
Assert "signup returns no token" ([bool]$reg.token -eq $false) "token was returned"
Assert "signup status is pending" ($reg.user.status -eq 'pending') "got $($reg.user.status)"
Check "new signup login -> 403" { Invoke-WebRequest -UseBasicParsing "$base/auth/login" -Method Post -ContentType 'application/json' -Body (@{ email=$newEmail; password='password123' } | ConvertTo-Json) } 403 | Out-Null

Write-Host "=== 3. Students aggregation ==="
$students = Check "GET /users" { Invoke-WebRequest -UseBasicParsing "$base/users" -Headers @{ Authorization = "Bearer $adminToken" } }
Info "returned $($students.users.Count) students"
$s = $students.users | Where-Object { $_.email -eq 'debjit.banerjee@campus.edu' } | Select-Object -First 1
Assert "aggregation exposes pendingCount" ($null -ne $s.pendingCount) "pendingCount missing"
Assert "aggregation exposes approvedCount" ($null -ne $s.approvedCount) "approvedCount missing"
Info "debjit: enrolled=$($s.enrolledEvents.Count) approved=$($s.approvedCount) pending=$($s.pendingCount) paid=$($s.paidCount) unpaid=$($s.unpaidCount) totalPaid=$($s.totalPaid) totalDue=$($s.totalDue)"

# A pending application must not inflate paid/unpaid analytics, only approved ones count.
$badPendingCounted = @($students.users | Where-Object { $_.pendingCount -gt 0 -and ($_.paidCount -gt $_.approvedCount -or $_.unpaidCount -gt $_.approvedCount) })
Assert "pending apps excluded from paid/unpaid counts" ($badPendingCounted.Count -eq 0) "$($badPendingCounted.Count) student(s) mismatched"

Write-Host "=== 4. Payment filter ==="
$paid = Check "payment=paid" { Invoke-WebRequest -UseBasicParsing "$base/users?payment=paid" -Headers @{ Authorization = "Bearer $adminToken" } }
$unpaid = Check "payment=unpaid" { Invoke-WebRequest -UseBasicParsing "$base/users?payment=unpaid" -Headers @{ Authorization = "Bearer $adminToken" } }
$partial = Check "payment=partial" { Invoke-WebRequest -UseBasicParsing "$base/users?payment=partial" -Headers @{ Authorization = "Bearer $adminToken" } }
$free = Check "payment=free" { Invoke-WebRequest -UseBasicParsing "$base/users?payment=free" -Headers @{ Authorization = "Bearer $adminToken" } }
Info "paid=$($paid.users.Count)  unpaid=$($unpaid.users.Count)  partial(both)=$($partial.users.Count)  free(no dues)=$($free.users.Count)"

$badPartial = @($partial.users | Where-Object { $_.paidCount -lt 1 -or $_.unpaidCount -lt 1 })
Assert "every 'partial' user has >=1 paid and >=1 unpaid" ($badPartial.Count -eq 0) "$($badPartial.Count) mismatch"
$badFree = @($free.users | Where-Object { $_.unpaidCount -gt 0 })
Assert "every 'free' user has no unpaid registrations" ($badFree.Count -eq 0) "$($badFree.Count) mismatch"

Write-Host "=== 5. Approve pending student account ==="
$pendingUser = $students.users | Where-Object { $_.email -eq $newEmail } | Select-Object -First 1
if ($pendingUser) {
  $appr = Check "approve student" { Invoke-WebRequest -UseBasicParsing "$base/users/$($pendingUser.id)/status" -Method Patch -Headers @{ Authorization = "Bearer $adminToken" } -ContentType 'application/json' -Body (@{ status='active' } | ConvertTo-Json) }
  Assert "approvedAt set" ([bool]$appr.user.approvedAt) "approvedAt missing"
  Check "approved student can log in" { Invoke-WebRequest -UseBasicParsing "$base/auth/login" -Method Post -ContentType 'application/json' -Body (@{ email=$newEmail; password='password123' } | ConvertTo-Json) } | Out-Null
  Check "deactivate then re-activate" { Invoke-WebRequest -UseBasicParsing "$base/users/$($pendingUser.id)/status" -Method Patch -Headers @{ Authorization = "Bearer $adminToken" } -ContentType 'application/json' -Body (@{ status='deactivated' } | ConvertTo-Json) } | Out-Null
  Check "deactivated student login -> 403" { Invoke-WebRequest -UseBasicParsing "$base/auth/login" -Method Post -ContentType 'application/json' -Body (@{ email=$newEmail; password='password123' } | ConvertTo-Json) } 403 | Out-Null
} else { Write-Host "  FAIL  pending student missing from list"; $script:fail++ }

Write-Host "=== 6. Payment toggle (admin) ==="
$regs = Check "GET /registrations" { Invoke-WebRequest -UseBasicParsing "$base/registrations" -Headers @{ Authorization = "Bearer $adminToken" } }
Assert "registrations list reports pendingApplications" ($null -ne $regs.pendingApplications) "pendingApplications missing"
Info "pendingApplications=$($regs.pendingApplications)"
$u = $regs.registrations | Where-Object { $_.paymentStatus -eq 'unpaid' -and $_.status -eq 'Approved' } | Select-Object -First 1
if ($u) {
  $pr = Check "PATCH payment -> paid" { Invoke-WebRequest -UseBasicParsing "$base/registrations/$($u.registrationId)/payment" -Method Patch -Headers @{ Authorization = "Bearer $adminToken" } -ContentType 'application/json' -Body (@{ paymentStatus='paid'; paymentMethod='UPI' } | ConvertTo-Json) }
  Assert "paidAt set after marking paid" ([bool]$pr.registration.paidAt) "paidAt missing"
  Check "PATCH payment -> unpaid" { Invoke-WebRequest -UseBasicParsing "$base/registrations/$($u.registrationId)/payment" -Method Patch -Headers @{ Authorization = "Bearer $adminToken" } -ContentType 'application/json' -Body (@{ paymentStatus='unpaid' } | ConvertTo-Json) } | Out-Null
  Check "student cannot set payment -> 403" { Invoke-WebRequest -UseBasicParsing "$base/registrations/$($u.registrationId)/payment" -Method Patch -Headers @{ Authorization = "Bearer $stuToken" } -ContentType 'application/json' -Body (@{ paymentStatus='paid' } | ConvertTo-Json) } 403 | Out-Null
  Check "invalid paymentStatus -> 400" { Invoke-WebRequest -UseBasicParsing "$base/registrations/$($u.registrationId)/payment" -Method Patch -Headers @{ Authorization = "Bearer $adminToken" } -ContentType 'application/json' -Body (@{ paymentStatus='refunded' } | ConvertTo-Json) } 400 | Out-Null
} else { Write-Host "  FAIL  no approved unpaid registration found"; $script:fail++ }

Write-Host "=== 7. Analytics reflects approval states ==="
$an = Check "GET /analytics/admin" { Invoke-WebRequest -UseBasicParsing "$base/analytics/admin" -Headers @{ Authorization = "Bearer $adminToken" } }
$a = $an.analytics.adminStats
Info "revenue=$($a.totalRevenue) due=$($a.totalDue) paid=$($a.paidCount) unpaid=$($a.unpaidCount) pendingAccounts=$($a.pendingApprovals) pendingApplications=$($a.pendingApplications)"
Assert "analytics exposes pendingApplications" ($null -ne $a.pendingApplications) "missing"
Assert "analytics exposes latestApplications" ($null -ne $an.analytics.latestApplications) "missing"
$paidInPending = @($an.analytics.latestApplications | Where-Object { $_.paymentStatus -eq 'paid' })
Assert "pending applications are not paid" ($paidInPending.Count -eq 0) "$($paidInPending.Count) pending app(s) marked paid"

Write-Host "=== 8. Public events + removed routes ==="
$ev = Check "GET /events (public)" { Invoke-WebRequest -UseBasicParsing "$base/events" }
Info "$($ev.events.Count) events, all approvalStatus: $(($ev.events.approvalStatus | Sort-Object -Unique) -join ',')"
Check "GET /venues -> 404" { Invoke-WebRequest -UseBasicParsing "$base/venues" } 404 | Out-Null
Check "GET /sponsors -> 404" { Invoke-WebRequest -UseBasicParsing "$base/sponsors" } 404 | Out-Null
Check "GET /analytics/organizer -> 404" { Invoke-WebRequest -UseBasicParsing "$base/analytics/organizer" -Headers @{ Authorization = "Bearer $adminToken" } } 404 | Out-Null
Check "GET /events/mine -> 404" { Invoke-WebRequest -UseBasicParsing "$base/events/mine" -Headers @{ Authorization = "Bearer $adminToken" } } 404 | Out-Null

Write-Host "=== 9. Category CRUD ==="
$cats = Check "GET /categories (public)" { Invoke-WebRequest -UseBasicParsing "$base/categories" }
Assert "categories expose eventCount" ($null -ne $cats.categories[0].eventCount) "eventCount missing"
Info "$($cats.categories.Count) categories; first=$($cats.categories[0].slug) events=$($cats.categories[0].eventCount)"

$catName = "Smoke Cat $([guid]::NewGuid().ToString('N').Substring(0,6))"
$nc = Check "POST /categories" { Invoke-WebRequest -UseBasicParsing "$base/categories" -Method Post -Headers @{ Authorization = "Bearer $adminToken" } -ContentType 'application/json' -Body (@{ name=$catName; description='created by verify script' } | ConvertTo-Json) } 201
$catSlug = $nc.category.slug
Info "created slug=$catSlug"

Check "POST /categories (student) -> 403" { Invoke-WebRequest -UseBasicParsing "$base/categories" -Method Post -Headers @{ Authorization = "Bearer $stuToken" } -ContentType 'application/json' -Body (@{ name='nope' } | ConvertTo-Json) } 403 | Out-Null
Check "duplicate category name -> 400" { Invoke-WebRequest -UseBasicParsing "$base/categories" -Method Post -Headers @{ Authorization = "Bearer $adminToken" } -ContentType 'application/json' -Body (@{ name=$catName } | ConvertTo-Json) } 400 | Out-Null
Check "category name required -> 400" { Invoke-WebRequest -UseBasicParsing "$base/categories" -Method Post -Headers @{ Authorization = "Bearer $adminToken" } -ContentType 'application/json' -Body (@{ description='no name' } | ConvertTo-Json) } 400 | Out-Null

$upd = Check "PATCH /categories/:slug" { Invoke-WebRequest -UseBasicParsing "$base/categories/$catSlug" -Method Patch -Headers @{ Authorization = "Bearer $adminToken" } -ContentType 'application/json' -Body (@{ name="$catName Renamed"; description='renamed by verify script' } | ConvertTo-Json) }
Assert "slug stays immutable on rename" ($upd.category.slug -eq $catSlug) "slug changed to $($upd.category.slug)"
Assert "rename applied" ($upd.category.name -eq "$catName Renamed") "name is $($upd.category.name)"

Write-Host "=== 10. Event create: priceAmount + auto-Approved ==="
$paidEvent = Check "POST /events paid (admin)" { Invoke-WebRequest -UseBasicParsing "$base/events" -Method Post -Headers @{ Authorization = "Bearer $adminToken" } -ContentType 'application/json' -Body (@{ title="Smoke Paid $([guid]::NewGuid().ToString('N').Substring(0,6))"; category=$catSlug; date='2026-11-20'; time='10:00 AM'; endTime='04:00 PM'; venue='Test Hall'; maxParticipants=50; price='Rs.250'; priceAmount=250 } | ConvertTo-Json) } 201
Assert "event auto-approved" ($paidEvent.event.approvalStatus -eq 'approved') "got $($paidEvent.event.approvalStatus)"
Assert "priceAmount stored" ($paidEvent.event.priceAmount -eq 250) "got $($paidEvent.event.priceAmount)"
$paidEventId = $paidEvent.event.id

$freeEvent = Check "POST /events free (admin)" { Invoke-WebRequest -UseBasicParsing "$base/events" -Method Post -Headers @{ Authorization = "Bearer $adminToken" } -ContentType 'application/json' -Body (@{ title="Smoke Free $([guid]::NewGuid().ToString('N').Substring(0,6))"; category=$catSlug; date='2026-11-21'; time='11:00 AM'; endTime='02:00 PM'; venue='Test Hall'; maxParticipants=20; price='Free'; priceAmount=0 } | ConvertTo-Json) } 201
$freeEventId = $freeEvent.event.id

Check "POST /events (student) -> 403" { Invoke-WebRequest -UseBasicParsing "$base/events" -Method Post -Headers @{ Authorization = "Bearer $stuToken" } -ContentType 'application/json' -Body (@{ title='x'; category=$catSlug; date='2026-11-20' } | ConvertTo-Json) } 403 | Out-Null

Write-Host "=== 11. Paid event: PENDING application holds a seat ==="
$beforePaid = Check "GET paid event (before)" { Invoke-WebRequest -UseBasicParsing "$base/events/$paidEventId" }
$seatsBefore = $beforePaid.event.seatsLeft
$appPaid = Check "apply to paid event" { Invoke-WebRequest -UseBasicParsing "$base/registrations/events/$paidEventId/register" -Method Post -Headers @{ Authorization = "Bearer $stuToken" } -ContentType 'application/json' -Body (@{ customDetails=@{ ticketTier='General'; teamName='Solo Participant' } } | ConvertTo-Json) } 201
Assert "paid application starts Pending" ($appPaid.registration.status -eq 'Pending') "got $($appPaid.registration.status)"
Assert "paid application not yet paid" ($appPaid.registration.paymentStatus -ne 'paid') "got $($appPaid.registration.paymentStatus)"
$appPaidId = $appPaid.registration.registrationId

$afterPaid = Check "GET paid event (after apply)" { Invoke-WebRequest -UseBasicParsing "$base/events/$paidEventId" }
Assert "pending application holds a seat" ($afterPaid.event.seatsLeft -eq ($seatsBefore - 1)) "seatsBefore=$seatsBefore after=$($afterPaid.event.seatsLeft)"

Check "duplicate application -> 400" { Invoke-WebRequest -UseBasicParsing "$base/registrations/events/$paidEventId/register" -Method Post -Headers @{ Authorization = "Bearer $stuToken" } -ContentType 'application/json' -Body (@{ customDetails=@{} } | ConvertTo-Json) } 400 | Out-Null

Write-Host "=== 12. Approval gate ==="
$mineApp = Check "student sees own application" { Invoke-WebRequest -UseBasicParsing "$base/registrations/me" -Headers @{ Authorization = "Bearer $stuToken" } }
$mineRow = $mineApp.registrations | Where-Object { $_.registrationId -eq $appPaidId } | Select-Object -First 1
Assert "pending application is not a usable ticket" (-not ($mineRow.status -eq 'Approved' -and $mineRow.paymentStatus -eq 'paid')) "status=$($mineRow.status) payment=$($mineRow.paymentStatus)"

Check "student cannot review own application -> 403" { Invoke-WebRequest -UseBasicParsing "$base/registrations/$appPaidId/review" -Method Patch -Headers @{ Authorization = "Bearer $stuToken" } -ContentType 'application/json' -Body (@{ decision='approve' } | ConvertTo-Json) } 403 | Out-Null
Check "invalid decision -> 400" { Invoke-WebRequest -UseBasicParsing "$base/registrations/$appPaidId/review" -Method Patch -Headers @{ Authorization = "Bearer $adminToken" } -ContentType 'application/json' -Body (@{ decision='maybe' } | ConvertTo-Json) } 400 | Out-Null
Check "reject without reason -> 400" { Invoke-WebRequest -UseBasicParsing "$base/registrations/$appPaidId/review" -Method Patch -Headers @{ Authorization = "Bearer $adminToken" } -ContentType 'application/json' -Body (@{ decision='reject' } | ConvertTo-Json) } 400 | Out-Null

Write-Host "=== 13. Free event: auto-approved ticket ==="
$appFree = Check "register for free event" { Invoke-WebRequest -UseBasicParsing "$base/registrations/events/$freeEventId/register" -Method Post -Headers @{ Authorization = "Bearer $stuToken" } -ContentType 'application/json' -Body (@{ customDetails=@{ ticketTier='Open' } } | ConvertTo-Json) } 201
Assert "free application auto-Approved" ($appFree.registration.status -eq 'Approved') "got $($appFree.registration.status)"
Assert "free application auto-paid" ($appFree.registration.paymentStatus -eq 'paid') "got $($appFree.registration.paymentStatus)"
$appFreeId = $appFree.registration.registrationId

Write-Host "=== 14. Student applies to a second event ==="
Check "duplicate on already-registered event -> 400" { Invoke-WebRequest -UseBasicParsing "$base/registrations/events/$freeEventId/register" -Method Post -Headers @{ Authorization = "Bearer $stuToken" } -ContentType 'application/json' -Body (@{ customDetails=@{} } | ConvertTo-Json) } 400 | Out-Null
$freeEvent2 = Check "POST /events free #2" { Invoke-WebRequest -UseBasicParsing "$base/events" -Method Post -Headers @{ Authorization = "Bearer $adminToken" } -ContentType 'application/json' -Body (@{ title="Smoke Free 2 $([guid]::NewGuid().ToString('N').Substring(0,6))"; category=$catSlug; date='2026-11-22'; time='11:00 AM'; endTime='02:00 PM'; venue='Test Hall'; maxParticipants=20; price='Free'; priceAmount=0 } | ConvertTo-Json) } 201
$appFree2 = Check "apply to a different event" { Invoke-WebRequest -UseBasicParsing "$base/registrations/events/$($freeEvent2.event.id)/register" -Method Post -Headers @{ Authorization = "Bearer $stuToken" } -ContentType 'application/json' -Body (@{ customDetails=@{} } | ConvertTo-Json) } 201
Assert "multi-event application allowed" ($appFree2.registration.status -eq 'Approved') "got $($appFree2.registration.status)"

Write-Host "=== 15. Admin Approve & Mark Paid ==="
$apv = Check "review -> approve + paid" { Invoke-WebRequest -UseBasicParsing "$base/registrations/$appPaidId/review" -Method Patch -Headers @{ Authorization = "Bearer $adminToken" } -ContentType 'application/json' -Body (@{ decision='approve'; paymentStatus='paid'; amountPaid=250; paymentMethod='Cash' } | ConvertTo-Json) }
Assert "application now Approved" ($apv.registration.status -eq 'Approved') "got $($apv.registration.status)"
Assert "payment recorded" ($apv.registration.paymentStatus -eq 'paid') "got $($apv.registration.paymentStatus)"
Assert "ticket now usable" ($apv.registration.status -eq 'Approved' -and $apv.registration.paymentStatus -eq 'paid') "gate not satisfied"

Check "re-review an already approved app -> 400" { Invoke-WebRequest -UseBasicParsing "$base/registrations/$appPaidId/review" -Method Patch -Headers @{ Authorization = "Bearer $adminToken" } -ContentType 'application/json' -Body (@{ decision='reject'; reason='too late' } | ConvertTo-Json) } 400 | Out-Null

$afterApprove = Check "GET paid event (after approve)" { Invoke-WebRequest -UseBasicParsing "$base/events/$paidEventId" }
Assert "approval keeps the held seat" ($afterApprove.event.seatsLeft -eq ($seatsBefore - 1)) "seatsBefore=$seatsBefore now=$($afterApprove.event.seatsLeft)"

Write-Host "=== 16. Reject releases the seat and allows re-application ==="
# Must be a paid event: free applications auto-approve and never enter the review queue.
$paidEvent3 = Check "POST /events paid #3" { Invoke-WebRequest -UseBasicParsing "$base/events" -Method Post -Headers @{ Authorization = "Bearer $adminToken" } -ContentType 'application/json' -Body (@{ title="Smoke Paid 3 $([guid]::NewGuid().ToString('N').Substring(0,6))"; category=$catSlug; date='2026-11-23'; time='11:00 AM'; endTime='02:00 PM'; venue='Test Hall'; maxParticipants=20; price='Rs.400'; priceAmount=400 } | ConvertTo-Json) } 201
$ev3Id = $paidEvent3.event.id
$ev3Before = Check "GET event #3 (before)" { Invoke-WebRequest -UseBasicParsing "$base/events/$ev3Id" }
$seats3 = $ev3Before.event.seatsLeft
$app3 = Check "apply to event #3" { Invoke-WebRequest -UseBasicParsing "$base/registrations/events/$ev3Id/register" -Method Post -Headers @{ Authorization = "Bearer $stuToken" } -ContentType 'application/json' -Body (@{ customDetails=@{} } | ConvertTo-Json) } 201
Assert "event #3 application is Pending" ($app3.registration.status -eq 'Pending') "got $($app3.registration.status)"
$app3Id = $app3.registration.registrationId
$rej = Check "review -> reject" { Invoke-WebRequest -UseBasicParsing "$base/registrations/$app3Id/review" -Method Patch -Headers @{ Authorization = "Bearer $adminToken" } -ContentType 'application/json' -Body (@{ decision='reject'; reason='Event window already closed.' } | ConvertTo-Json) }
Assert "application now Rejected" ($rej.registration.status -eq 'Rejected') "got $($rej.registration.status)"
Assert "reject reason stored" ($rej.registration.rejectReason -eq 'Event window already closed.') "got '$($rej.registration.rejectReason)'"

$ev3After = Check "GET event #3 (after reject)" { Invoke-WebRequest -UseBasicParsing "$base/events/$ev3Id" }
Assert "rejection releases the seat" ($ev3After.event.seatsLeft -eq $seats3) "before=$seats3 after=$($ev3After.event.seatsLeft)"

$reapply = Check "re-apply after rejection" { Invoke-WebRequest -UseBasicParsing "$base/registrations/events/$ev3Id/register" -Method Post -Headers @{ Authorization = "Bearer $stuToken" } -ContentType 'application/json' -Body (@{ customDetails=@{} } | ConvertTo-Json) } 201
Assert "re-application is a fresh application" ($reapply.registration.registrationId -ne $app3Id) "same id reused"
Assert "re-application is Pending again" ($reapply.registration.status -eq 'Pending') "got $($reapply.registration.status)"
$reapplyId = $reapply.registration.registrationId

Write-Host "=== 17. Cancelling a pending application releases the seat ==="
$ev3b = Check "GET event #3 (before cancel)" { Invoke-WebRequest -UseBasicParsing "$base/events/$ev3Id" }
$seats3b = $ev3b.event.seatsLeft
$can = Check "student cancels application" { Invoke-WebRequest -UseBasicParsing "$base/registrations/$reapplyId" -Method Delete -Headers @{ Authorization = "Bearer $stuToken" } }
Assert "registration now Cancelled" ($can.registration.status -eq 'Cancelled') "got $($can.registration.status)"
$ev3c = Check "GET event #3 (after cancel)" { Invoke-WebRequest -UseBasicParsing "$base/events/$ev3Id" }
Assert "cancellation releases the seat" ($ev3c.event.seatsLeft -eq ($seats3b + 1)) "before=$seats3b after=$($ev3c.event.seatsLeft)"

Write-Host "=== 18. Roster only lists approved students ==="
$roster = Check "GET organizer-roster" { Invoke-WebRequest -UseBasicParsing "$base/registrations/organizer-roster" -Headers @{ Authorization = "Bearer $adminToken" } }
$badRoster = @($roster.attendees | Where-Object { $_.status -ne 'Approved' })
Assert "roster has no pending/rejected rows" ($badRoster.Count -eq 0) "$($badRoster.Count) non-approved attendee(s)"

Write-Host "=== 19. Status filter ==="
Check "GET /registrations?status=Pending" { Invoke-WebRequest -UseBasicParsing "$base/registrations?status=Pending" -Headers @{ Authorization = "Bearer $adminToken" } } | Out-Null
Check "GET /registrations?status=Bogus -> 400" { Invoke-WebRequest -UseBasicParsing "$base/registrations?status=Bogus" -Headers @{ Authorization = "Bearer $adminToken" } } 400 | Out-Null
$pendingOnly = Check "GET /registrations?status=Pending" { Invoke-WebRequest -UseBasicParsing "$base/registrations?status=Pending" -Headers @{ Authorization = "Bearer $adminToken" } }
$allPending = @($pendingOnly.registrations | Where-Object { $_.status -ne 'Pending' })
Assert "status filter returns only Pending" ($allPending.Count -eq 0) "$($allPending.Count) wrong row(s)"

Write-Host "=== 20. Category delete rules ==="
Check "delete in-use category -> 409" { Invoke-WebRequest -UseBasicParsing "$base/categories/$catSlug" -Method Delete -Headers @{ Authorization = "Bearer $adminToken" } } 409 | Out-Null
Check "delete category (student) -> 403" { Invoke-WebRequest -UseBasicParsing "$base/categories/$catSlug" -Method Delete -Headers @{ Authorization = "Bearer $stuToken" } } 403 | Out-Null

Write-Host "=== CLEANUP ==="
Check "delete smoke event #1" { Invoke-WebRequest -UseBasicParsing "$base/events/$paidEventId" -Method Delete -Headers @{ Authorization = "Bearer $adminToken" } } | Out-Null
Check "delete smoke event #2" { Invoke-WebRequest -UseBasicParsing "$base/events/$freeEventId" -Method Delete -Headers @{ Authorization = "Bearer $adminToken" } } | Out-Null
Check "delete smoke event #2b" { Invoke-WebRequest -UseBasicParsing "$base/events/$($freeEvent2.event.id)" -Method Delete -Headers @{ Authorization = "Bearer $adminToken" } } | Out-Null
Check "delete smoke event #3" { Invoke-WebRequest -UseBasicParsing "$base/events/$ev3Id" -Method Delete -Headers @{ Authorization = "Bearer $adminToken" } } | Out-Null
Check "delete smoke category" { Invoke-WebRequest -UseBasicParsing "$base/categories/$catSlug" -Method Delete -Headers @{ Authorization = "Bearer $adminToken" } } | Out-Null
Check "delete smoke student" { Invoke-WebRequest -UseBasicParsing "$base/users/$($pendingUser.id)" -Method Delete -Headers @{ Authorization = "Bearer $adminToken" } } | Out-Null

Write-Host ""
Write-Host "============================================"
Write-Host "  PASS: $script:pass    FAIL: $script:fail"
Write-Host "============================================"
if ($script:fail -gt 0) { exit 1 }
