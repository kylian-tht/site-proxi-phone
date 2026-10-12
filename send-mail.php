<?php
/**
 * PROXI-PHONE Vitré - Traitement du formulaire de contact
 * Compatible hébergement mutualisé OVH (PHP mail())
 * Destinataire : sas-proxiphone@outlook.com
 */

header('Content-Type: application/json; charset=utf-8');

// Autoriser uniquement les requêtes POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Méthode non autorisée.']);
    exit;
}

// Vérification anti-spam basique (honeypot)
if (!empty($_POST['website'])) {
    // Si le champ caché honeypot est rempli, on feint le succès sans rien envoyer
    echo json_encode(['success' => true, 'message' => 'Message envoyé avec succès.']);
    exit;
}

// Nettoyage et récupération des données
$nom = trim($_POST['nom'] ?? '');
$telephone = trim($_POST['telephone'] ?? '');
$email = trim($_POST['email'] ?? '');
$message = trim($_POST['message'] ?? '');

// Validation des champs obligatoires
if (empty($nom) || empty($telephone) || empty($message)) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'message' => 'Veuillez renseigner votre nom, votre numéro de téléphone et votre message.'
    ]);
    exit;
}

// Validation du consentement RGPD
if (empty($_POST['rgpd'])) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'message' => 'Veuillez accepter la politique de traitement des données pour envoyer votre message.'
    ]);
    exit;
}

// Validation basique de l'email s'il est renseigné
if (!empty($email) && !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    http_response_code(400);
    echo json_encode([
        'success' => false,
        'message' => 'Adresse email invalide.'
    ]);
    exit;
}

// Configuration de l'envoi
$to = 'sas-proxiphone@outlook.com';
$subject = '=?UTF-8?B?' . base64_encode('Nouveau message depuis le site web Proxi-Phone - ' . $nom) . '?=';

// Construction du corps du mail
$body = "Vous avez reçu un nouveau message depuis le formulaire de contact du site Proxi-Phone Vitré :\n\n";
$body .= "--------------------------------------------------\n";
$body .= "Nom / Prénom : " . $nom . "\n";
$body .= "Téléphone    : " . $telephone . "\n";
$body .= "Email        : " . ($email ?: 'Non renseigné') . "\n";
$body .= "Date & Heure : " . date('d/m/Y à H:i') . "\n";
$body .= "--------------------------------------------------\n\n";
$body .= "Message :\n" . $message . "\n\n";
$body .= "--------------------------------------------------\n";
$body .= "Email automatique envoyé depuis proxi-phone.fr\n";

// En-têtes pour OVH (expéditeur local du serveur ou l'email du client si valide)
$headers = [];
$headers[] = 'MIME-Version: 1.0';
$headers[] = 'Content-Type: text/plain; charset=UTF-8';
$headers[] = 'Content-Transfer-Encoding: 8bit';

if (!empty($email)) {
    $headers[] = 'Reply-To: ' . $email;
}
$headers[] = 'X-Mailer: PHP/' . phpversion();

// Envoi du mail
$sent = @mail($to, $subject, $body, implode("\r\n", $headers));

if ($sent) {
    echo json_encode([
        'success' => true,
        'message' => 'Merci ' . htmlspecialchars($nom, ENT_QUOTES, 'UTF-8') . ' ! Votre message a bien été envoyé. Notre équipe vous recontactera rapidement.'
    ]);
} else {
    // Si mail() local échoue (ex: test local sans serveur SMTP), réponse propre
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => 'Impossible d\'envoyer le message pour le moment. Vous pouvez nous joindre directement par téléphone au 06 37 98 13 88 ou à sas-proxiphone@outlook.com.'
    ]);
}
