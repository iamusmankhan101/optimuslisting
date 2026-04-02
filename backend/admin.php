<?php
require_once 'config.php';
// Override JSON content-type from config for HTML page
header('Content-Type: text/html; charset=UTF-8');

// Read filters
$search = $_GET['search'] ?? '';
$sortBy = $_GET['sortBy'] ?? 'created_at';
$order = strtoupper($_GET['order'] ?? 'DESC') === 'ASC' ? 'ASC' : 'DESC';

$allowedSort = ['id','property_code','emirate','created_at'];
if (!in_array($sortBy, $allowedSort)) { $sortBy = 'created_at'; }

// Fetch data
$listings = [];
$error = '';
try {
    $pdo = getDB();
    if ($search) {
        $stmt = $pdo->prepare(
            "SELECT * FROM property_listings 
             WHERE property_code LIKE ? OR emirate LIKE ? OR area_community LIKE ? 
             OR building_name LIKE ? OR agent_name LIKE ? OR email LIKE ?
             ORDER BY $sortBy $order"
        );
        $s = "%$search%";
        $stmt->execute([$s,$s,$s,$s,$s,$s]);
    } else {
        $stmt = $pdo->query("SELECT * FROM property_listings ORDER BY $sortBy $order");
    }
    $listings = $stmt->fetchAll(PDO::FETCH_ASSOC);
} catch (Throwable $e) {
    $error = 'Failed to fetch listings';
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Admin • Property Listings</title>
  <style>
    :root { --bg:#f5f7fb; --primary:#3498db; --primary-dark:#2980b9; --text:#2c3e50; --muted:#7f8c8d; --sidebar:#ffffff; --header:#ffffff; --border:#ecf0f1; }
    *{ box-sizing:border-box; }
    body{ margin:0; font-family:-apple-system,BlinkMacSystemFont,'Segoe UI','Roboto',sans-serif; background:linear-gradient(180deg,#e8f3ff 0%, #f8fafc 30%), var(--bg); }
    .layout{ display:grid; grid-template-columns: 260px 1fr; min-height:100vh; }
    .sidebar{ background:var(--sidebar); border-right:1px solid var(--border); padding:1rem; }
    .brand{ display:flex; align-items:center; gap:.6rem; padding:.75rem; border-radius:8px; background:#f0f6ff; color:#1e293b; font-weight:600; margin-bottom:.5rem; }
    .nav{ margin-top:.5rem; }
    .nav h6{ color:#94a3b8; font-size:.75rem; margin:.75rem 0 .25rem; letter-spacing:.08em; }
    .nav a{ display:flex; align-items:center; gap:.6rem; color:#334155; text-decoration:none; padding:.55rem .75rem; border-radius:8px; }
    .nav a:hover{ background:#f1f5f9; }
    .content{ background:transparent; }
    .topbar{ background:var(--header); border-bottom:1px solid var(--border); padding:1rem 1.5rem; display:flex; justify-content:space-between; align-items:center; }
    .actions{ display:flex; gap:.6rem; }
    .btn{ border:1px solid var(--border); background:#fff; color:#334155; padding:.5rem .9rem; border-radius:8px; cursor:pointer; }
    .btn-primary{ background:var(--primary); color:#fff; border-color:var(--primary); }
    .btn-primary:hover{ background:var(--primary-dark); }
    .container{ padding:1.25rem 1.5rem; }
    .card{ background:#fff; border:1px solid var(--border); border-radius:12px; box-shadow:0 10px 20px rgba(2,6,23,.04); }
    .card-header{ padding:1rem 1.25rem; display:flex; gap:.75rem; border-bottom:1px solid var(--border); }
    .tabs{ display:flex; gap:.5rem; }
    .tab{ padding:.4rem .8rem; border-radius:999px; background:#f1f5f9; color:#0f172a; font-weight:600; font-size:.85rem; cursor:pointer; }
    .tab.active{ background:#e0f2fe; color:#0369a1; }
    .toolbar{ margin-left:auto; display:flex; gap:.5rem; }
    .search{ flex:1; min-width:280px; padding:.55rem .8rem; border:1px solid var(--border); border-radius:8px; }
    .table-wrap{ overflow:auto; }
    table{ width:100%; border-collapse:collapse; }
    th{ background:#f8fafc; color:#0f172a; text-align:left; padding:0.9rem; border-bottom:1px solid var(--border); font-size:.9rem; }
    td{ padding:0.9rem; border-bottom:1px solid var(--border); color:#334155; }
    tr:hover{ background:#f9fafb; }
    .badge{ display:inline-flex; align-items:center; gap:.35rem; padding:.25rem .55rem; border-radius:999px; font-size:.75rem; font-weight:600; }
    .badge.blue{ background:#e0f2fe; color:#0369a1; }
    .badge.purple{ background:#ede9fe; color:#5b21b6; }
    .badge.green{ background:#dcfce7; color:#166534; }
    .badge.orange{ background:#ffedd5; color:#9a3412; }
    .nowrap{ white-space:nowrap; }
    .truncate{ max-width:260px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
    .modal-overlay{ position:fixed; inset:0; background:rgba(2,6,23,.55); display:none; align-items:center; justify-content:center; padding:1rem; }
    .modal{ background:#fff; max-width:900px; width:100%; max-height:90vh; overflow:auto; border-radius:12px; box-shadow:0 25px 60px rgba(2,6,23,.3); }
    .modal header{ display:flex; justify-content:space-between; align-items:center; padding:1rem 1.25rem; border-bottom:1px solid var(--border); }
    .modal .body{ padding:1rem 1.25rem; }
    .chip{ display:inline-block; margin:.15rem .25rem; padding:.2rem .5rem; background:#f1f5f9; border-radius:999px; font-size:.75rem; }
    /* Added styles to match screenshot more closely */
    .col-select{ width:40px; }
    .job-title{ display:flex; align-items:center; gap:.6rem; }
    .job-title .icon{ width:24px; height:24px; display:inline-flex; align-items:center; justify-content:center; border:1px solid var(--border); border-radius:6px; background:#fff; }
    .row-select{ width:16px; height:16px; }
  </style>
</head>
<body>
  <div class="layout">
    <aside class="sidebar">
      <div class="brand">⚙️ Synergy <small style="color:#64748b;font-weight:500">HR Management</small></div>
      <nav class="nav">
        <h6>MAIN</h6>
        <a href="#">Dashboard</a>
        <a href="#">Talent</a>
        <a href="#" style="background:#eff6ff">Jobs</a>
        <a href="#">Contacts</a>
        <a href="#">Clients</a>
        <a href="#">Hermes</a>
        <a href="#">UE Certification</a>
      </nav>
    </aside>
    <div class="content">
      <div class="topbar">
        <div>
          <div style="font-size:1.1rem;color:#0f172a;font-weight:700;">Create a new job</div>
          <div style="color:#64748b">Insert page description here.</div>
        </div>
        <div class="actions">
          <button class="btn">Drafts</button>
          <button class="btn btn-primary" onclick="alert('Action placeholder')">+ Create new job</button>
        </div>
      </div>

      <div class="container">
        <div class="card">
          <div class="card-header">
            <div class="tabs">
              <span class="tab active">All Jobs</span>
              <span class="tab">Job Descriptions</span>
            </div>
            <div class="toolbar">
              <form method="get" style="display:flex; gap:.5rem;">
                <input class="search" type="text" name="search" placeholder="Search jobs..." value="<?= htmlspecialchars($search) ?>" />
                <select name="sortBy" class="btn">
                  <option value="created_at" <?= $sortBy==='created_at'?'selected':'' ?>>Date</option>
                  <option value="id" <?= $sortBy==='id'?'selected':'' ?>>ID</option>
                  <option value="property_code" <?= $sortBy==='property_code'?'selected':'' ?>>Code</option>
                  <option value="emirate" <?= $sortBy==='emirate'?'selected':'' ?>>Emirate</option>
                </select>
                <select name="order" class="btn">
                  <option value="DESC" <?= $order==='DESC'?'selected':'' ?>>Desc</option>
                  <option value="ASC" <?= $order==='ASC'?'selected':'' ?>>Asc</option>
                </select>
                <button class="btn btn-primary" type="submit">Filter</button>
              </form>
            </div>
          </div>

          <div class="table-wrap">
            <table>
              <thead>
                <tr>
                  <th class="col-select"><input type="checkbox" aria-label="Select all jobs" onclick="toggleSelectAll(this)"></th>
                  <th>Job Title</th>
                  <th>Description</th>
                  <th>Job Owner</th>
                  <th class="nowrap">Type of job</th>
                  <th>Date Posted</th>
                </tr>
              </thead>
              <tbody>
                <?php if($error): ?>
                  <tr><td colspan="5" style="text-align:center;color:#ef4444; padding:1rem;"><?= htmlspecialchars($error) ?></td></tr>
                <?php elseif(empty($listings)): ?>
                  <tr><td colspan="5" style="text-align:center;color:#64748b; padding:1rem;">No listings found</td></tr>
                <?php else: ?>
                  <?php foreach($listings as $row): ?>
                    <tr onclick="openModal(<?= htmlspecialchars(json_encode($row)) ?>)">
                      <td class="col-select" onclick="event.stopPropagation()"><input type="checkbox" class="row-select" aria-label="Select job"></td>
                      <td>
                        <div class="job-title">
                          <span class="icon" aria-hidden="true">
                            <svg viewBox="0 0 24 24" width="16" height="16" xmlns="http://www.w3.org/2000/svg">
                              <path fill="#0A66C2" d="M4.98 3.5C4.98 4.88 3.87 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1 4.98 2.12 4.98 3.5zM0 8.98h5V22H0zM8.98 8.98h4.78v1.78h.07c.67-1.2 2.32-2.47 4.78-2.47 5.11 0 6.06 3.36 6.06 7.73V22h-5v-6.5c0-1.55-.03-3.54-2.16-3.54-2.16 0-2.49 1.68-2.49 3.42V22h-5V8.98z"/>
                            </svg>
                          </span>
                          <div style="font-weight:600;color:#0f172a;"><?= htmlspecialchars($row['sub_category'] ?? 'Role') ?></div>
                        </div>
                        <div style="color:#64748b;font-size:.85rem;"><?= htmlspecialchars($row['emirate'] ?? '-') ?></div>
                      </td>
                      <td class="truncate">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor.</td>
                      <td><?= htmlspecialchars($row['agent_name'] ?? 'Unknown') ?></td>
                      <td>
                        <span class="badge purple"><?= htmlspecialchars($row['purpose'] ?: 'Full-time') ?></span>
                        <span class="badge blue">Fully remote</span>
                        <span class="badge green">+4</span>
                      </td>
                      <td class="nowrap">
                        <?= isset($row['created_at']) ? date('d/m/Y', strtotime($row['created_at'])) : '-' ?>
                      </td>
                    </tr>
                  <?php endforeach; ?>
                <?php endif; ?>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div id="overlay" class="modal-overlay">
    <div class="modal">
      <header>
        <strong id="modalTitle">Job Details</strong>
        <button class="btn" onclick="closeModal()">✕</button>
      </header>
      <div class="body" id="modalBody"></div>
    </div>
  </div>

<script>
  function openModal(data){
    const overlay = document.getElementById('overlay');
    const title = document.getElementById('modalTitle');
    const body = document.getElementById('modalBody');
    title.textContent = (data.property_code||'') + ' • ' + (data.sub_category||'Details');
    body.innerHTML = `
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem;">
        <div>
          <h4>Property</h4>
          <div class="chip">Emirate: ${escapeHtml(data.emirate||'-')}</div>
          <div class="chip">Area: ${escapeHtml(data.area_community||'-')}</div>
          <div class="chip">Building: ${escapeHtml(data.building_name||'-')}</div>
          <div class="chip">Unit: ${escapeHtml(data.unit_number||'-')}</div>
        </div>
        <div>
          <h4>Specs</h4>
          <div class="chip">Beds: ${escapeHtml(data.bedrooms||'-')}</div>
          <div class="chip">Baths: ${escapeHtml(data.bathrooms||'-')}</div>
          <div class="chip">Size: ${escapeHtml(data.size_sqft||'-')} SqFt</div>
          <div class="chip">Furnishing: ${escapeHtml(data.furnishing||'-')}</div>
        </div>
      </div>
      <div style="margin-top:1rem;">
        <h4>Agent</h4>
        <div class="chip">${escapeHtml(data.agent_name||'-')}</div>
        <div class="chip">${escapeHtml(data.agent_email||'-')}</div>
        <div class="chip">${escapeHtml(data.agent_mobile||'-')}</div>
      </div>
    `;
    overlay.style.display='flex';
  }
  function closeModal(){ document.getElementById('overlay').style.display='none'; }
  function escapeHtml(str){ return String(str).replace(/[&<>"]+/g, s => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[s])); }
  function toggleSelectAll(master){
    document.querySelectorAll('.row-select').forEach(cb => { cb.checked = master.checked; });
  }
</script>
</body>
</html>