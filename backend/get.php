<?php
// CORS headers for dev from React on localhost:3000
header('Access-Control-Allow-Origin: http://localhost:3000');
header('Access-Control-Allow-Methods: GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}
require_once 'config.php';

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit;
}

$search = $_GET['search'] ?? '';
$sortBy = $_GET['sortBy'] ?? 'created_at';
$order = $_GET['order'] ?? 'DESC';

$allowedSort = ['id', 'name', 'email', 'created_at'];
if (!in_array($sortBy, $allowedSort)) {
    $sortBy = 'created_at';
}

$order = strtoupper($order) === 'ASC' ? 'ASC' : 'DESC';

try {
    $pdo = getDB();
    
    if ($search) {
        $stmt = $pdo->prepare(
            "SELECT * FROM property_listings 
             WHERE property_code LIKE ? OR emirate LIKE ? OR area_community LIKE ? 
             OR building_name LIKE ? OR agent_name LIKE ? OR email LIKE ?
             ORDER BY $sortBy $order"
        );
        $searchTerm = "%$search%";
        $stmt->execute([$searchTerm, $searchTerm, $searchTerm, $searchTerm, $searchTerm, $searchTerm]);
    } else {
        $stmt = $pdo->query("SELECT * FROM property_listings ORDER BY $sortBy $order");
    }
    
    $results = $stmt->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode(['success' => true, 'data' => $results]);
} catch(PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Failed to fetch submissions']);
}
?>
