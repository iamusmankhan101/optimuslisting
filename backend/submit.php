<?php
// CORS for React dev server
header('Access-Control-Allow-Origin: http://localhost:3000');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Content-Type: application/json');
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

require_once 'config.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
    exit;
}

$data = json_decode(file_get_contents('php://input'), true);

if (!$data || !isset($data['email'])) {
    http_response_code(400);
    echo json_encode(['error' => 'Email is required']);
    exit;
}

try {
    $pdo = getDB();
    $stmt = $pdo->prepare(
        "INSERT INTO property_listings (
            email, source_of_listing, category, sub_category, purpose,
            property_code, emirate, area_community, building_name, unit_number, google_pin,
            bedrooms, bathrooms, size_sqft, maid_room, furnishing, property_condition,
            sale_price, unit_status, rented_details, notice_given, sales_agent_commission,
            asking_rent, number_of_chq, security_deposit, rent_agent_commission,
            keys_status, viewing_status, more_information, property_images, documents,
            agent_code, agent_name, agent_mobile, agent_email, agent_agency
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)"
    );
    
    $stmt->execute([
        $data['email'],
        $data['source_of_listing'] ?? null,
        $data['category'] ?? null,
        $data['sub_category'] ?? null,
        $data['purpose'] ?? null,
        $data['property_code'] ?? null,
        $data['emirate'] ?? null,
        $data['area_community'] ?? null,
        $data['building_name'] ?? null,
        $data['unit_number'] ?? null,
        $data['google_pin'] ?? null,
        $data['bedrooms'] ?? null,
        $data['bathrooms'] ?? null,
        $data['size_sqft'] ?? null,
        $data['maid_room'] ?? null,
        $data['furnishing'] ?? null,
        $data['property_condition'] ?? null,
        $data['sale_price'] ?? null,
        $data['unit_status'] ?? null,
        $data['rented_details'] ?? null,
        $data['notice_given'] ?? null,
        $data['sales_agent_commission'] ?? null,
        $data['asking_rent'] ?? null,
        $data['number_of_chq'] ?? null,
        $data['security_deposit'] ?? null,
        $data['rent_agent_commission'] ?? null,
        $data['keys_status'] ?? null,
        $data['viewing_status'] ?? null,
        $data['more_information'] ?? null,
        $data['property_images'] ?? null,
        $data['documents'] ?? null,
        $data['agent_code'] ?? null,
        $data['agent_name'] ?? null,
        $data['agent_mobile'] ?? null,
        $data['agent_email'] ?? null,
        $data['agent_agency'] ?? null
    ]);
    
    echo json_encode([
        'success' => true,
        'id' => $pdo->lastInsertId()
    ]);
} catch(PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Failed to save submission: ' . $e->getMessage()]);
}
?>
