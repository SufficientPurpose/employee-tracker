INSERT INTO
  department (name)
VALUES
  ("Human Resources"),
  ("Maintance"),
  ("Engineering"),
  ("Custodian"),
  ("Machine Operator");
INSERT INTO
  role (title, salary, department_id) VALUE 
  ("human resources", 78000.00, 2),
  ("engineer", 85000, 1),
  ("maintance", 55000, 2),
  ("custodian", 45080, 3),
  ("machine operator", 40000, 4),
  ("manager", 48750, 5);
INSERT INTO
  employee (first_name, last_name, role_id) VALUE 
  ("James", "Bond", 2),
  ("Justin", "Simmons", 2),
  ("Vance", "Hill", 3),
  ("Cara", "Boyd", 5),
  ("Helen", "Chandler", 4),
  ("Jean", "Blue", 1),
  ("Daryl", "Reeds", 1);