<?php
  include 'dependencies';
  
  $conn = new mysqli("Host IP", "User", "Auth", "Database"); // placeholder values for public release

  if ($conn->connect_error) {
      die("Connection failed: " . $conn->connect_error);
  }

  $data = json_decode(file_get_contents('php://input'), true);
  $name = $data['name'];
  $policy = $data['policy'];
  $agreement_date = $data['agreement_date'];
  $recorded_date = $data['recorded_date'];
  $agreed = $data['agreed'];

  if($policy=='Sparkling H2O2'){
    $stmt = $conn->prepare("INSERT INTO Sparkling_H2O2(name, policy, agreed, agreement_date, recorded_date) VALUES(?, ?, ?, ?, ?)");
    $stmt->bind_param("sssss", $name, $policy, $agreed, $agreement_date, $recorded_date);
  }

  $stmt->execute();

  $stmt->close();
  $conn->close();
?>