

connection.connect(function (err) {
    if (err) throw err;
    console.log("Connected as Id" + connection.threadId);
    startApp();
    runSearch();
  });
  function startApp() {
    console.log(
      chalk.redBright(`
  ---------------------------------------------------------------------------------------                                                
       ________                          __                                              
      /        |                        /  |                                             
      $$$$$$$$/  _____  ____    ______  $$ |  ______   __    __   ______    ______       
      $$ |__    /     \/    \  /      \ $$ | /      \ /  |  /  | /      \  /      \      
      $$    |   $$$$$$ $$$$  |/$$$$$$  |$$ |/$$$$$$  |$$ |  $$ |/$$$$$$  |/$$$$$$  |     
      $$$$$/    $$ | $$ | $$ |$$ |  $$ |$$ |$$ |  $$ |$$ |  $$ |$$    $$ |$$    $$ |     
      $$ |_____ $$ | $$ | $$ |$$ |__$$ |$$ |$$ \__$$ |$$ \__$$ |$$$$$$$$/ $$$$$$$$/      
      $$       |$$ | $$ | $$ |$$    $$/ $$ |$$    $$/ $$    $$ |$$       |$$       |     
      $$$$$$$$/ $$/  $$/  $$/ $$$$$$$/  $$/  $$$$$$/   $$$$$$$ | $$$$$$$/  $$$$$$$/      
                              $$ |                    /  \__$$ |                         
                              $$ |                    $$    $$/                          
                              $$/                      $$$$$$/                           
       __       __                                                                       
      /  \     /  |                                                                      
      $$  \   /$$ |  ______   _______    ______    ______    ______    ______            
      $$$  \ /$$$ | /      \ /       \  /      \  /      \  /      \  /      \           
      $$$$  /$$$$ | $$$$$$  |$$$$$$$  | $$$$$$  |/$$$$$$  |/$$$$$$  |/$$$$$$  |          
      $$ $$ $$/$$ | /    $$ |$$ |  $$ | /    $$ |$$ |  $$ |$$    $$ |$$ |  $$/           
      $$ |$$$/ $$ |/$$$$$$$ |$$ |  $$ |/$$$$$$$ |$$ \__$$ |$$$$$$$$/ $$ |                
      $$ | $/  $$ |$$    $$ |$$ |  $$ |$$    $$ |$$    $$ |$$       |$$ |                
      $$/      $$/  $$$$$$$/ $$/   $$/  $$$$$$$/  $$$$$$$ | $$$$$$$/ $$/                 
                                                 /  \__$$ |                              
                                                 $$    $$/                               
                                                  $$$$$$/                                                                    
  -----------------------------------------------------------------------------------------
  `)
    );
  }
  
  function setList() {
    connection.query("SELECT * FROM role", function (err, res) {
      if (err) throw err;
      for (var i = 0; i < res.length; i++) {
        roleArr.push({ name: res[i].title, id: res[i].id });
      }
    });
    connection.query("SELECT * FROM employee", function (err, res) {
      if (err) throw err;
      for (var i = 0; i < res.length; i++) {
        employeeArr.push({ name: res[i].last_name, id: res[i].id });
      }
    });
    connection.query("SELECT * FROM department", function (err, res) {
      if (err) throw err;
      for (var i = 0; i < res.length; i++) {
        departArr.push({ name: res[i].name, id: res[i].id });
      }
    });
    connection.query(
      "SELECT * FROM employee WHERE role_id= 2",
      function (err, res) {
        if (err) throw err;
        for (var i = 0; i < res.length; i++) {
          managerArr.push({ name: res[i].last_name, id: res[i].id });
        }
      }
    );
  }
  
  function runSearch() {
    setList();
    inquirer
      .prompt({
        type: "list",
        message: "What would you like to do?",
        choices: [
          "View",
          "Update",
          "Add",        
          "Delete",
          "Exit",
        ],
        name: "action",
      })
      .then(function (input) {
        console.log("User selected " + input.action);
  
        if (input.action === "View") {
          view()
        } else if (input.action === "Update") {
          update();        
        } else if (input.action === "Add") {
          add();      
        } else if (input.action === "Delete") {
          deleteInfo();
        } else if (input.action === "Exit") {
          connection.end();
        }
      });
  }
  function view() {
      inquirer
        .prompt([
          {
            type: "list",
            message: "By which mean would you like to view the company?",
            choices: [
              "By Department",
              "By Employees",
              "By Managers",
              "By Roles",          
            ],
            name: "view_type",
          },
        ])
        .then(function (input) {
          console.log("User selected " + input.view_type);
    
          if (input.view_type === "By Department") {
            byDepart();
        } else if (input.view_type === "By Employees") {
            byEmployees();
        } else if (input.view_type === " View Employees by Managers") {
            byManager();
        } else if (input.view_type === "By the Roles") {
            byRoles();
        }  
         
        });
    }
    
    function byDepart() {
      connection.query(
        "SELECT employee.first_name, employee.last_name, department.name AS Department FROM employee JOIN role ON employee.role_id = role.id JOIN department ON role.department_id = department.id ORDER BY employee.id;",
        function (err, res) {
          if (err) throw err;
          console.table(res);
          runSearch();
        }
      );
    }
    function byEmployees() {
        connection.query(
          "SELECT * FROM employee LEFT JOIN role ON employee.role_id = role.id",
          function (err, res) {
            if (err) throw err;
            console.table(res);
            runSearch();
          }
        );
      }
      function byManager() {
        connection.query(
          "SELECT * FROM employee ORDER BY manager_id",
          function (err, res) {
            if (err) throw err;
            console.table(res);
            runSearch();
          }
        );
      }
    function byRoles() {
      connection.query(
        "SELECT employee.first_name, employee.last_name, role.title AS Title FROM employee JOIN role ON employee.role_id = role.id;",
        function (err, res) {
          if (err) throw err;
          console.table(res);
          runSearch();
        }
      );
    }
  
    function update() {
      inquirer
        .prompt([
          {
            type: "list",
            message: "What needs to be brought up to date?",
            choices: ["Employees", "Managers"],
            name: "updateChoice",
          },
        ])
        .then(function (input) {
          console.log("User selected " + input.updateChoice);
    
          if (input.updateChoice === "Employees") {
            updateEmployees();
          } else if (input.updateChoice === "Managers") {
            updateManagers();
          }
        });
    }
    function updateEmployees() {
      inquirer
        .prompt([
          {
            type: "list",
            message: "Which employee needs to be updated?",
            choices: employeeArr,
            name: "employeeName",
          },
          {
            type: "list",
            message: "What is their new role by ID number?",
            choices: roleArr,
            name: "role",
          },
        ])
        .then(function (answer) {
          let roleID1;
          for (i = 0; i < roleArr.length; i++) {
            if (answer.role == roleArr[i].name) {
              roleID1 = roleArr[i].id;
            }
          }
          let employeeID;  
          for (i = 0; i < employeeArr.length; i++) {
            if (answer.employeeName == employeeArr[i].name) {
              employeeID = employeeArr[i].id;
            }
          }
          connection.query(
            "UPDATE employee SET role_id= ? WHERE id= ?",
            [roleID1, employeeID],
            function (err, res) {
              if (err) throw err;
              console.log(roleID1);
              console.log(employeeID);
              console.table("updated employee");
              runSearch();
            }
          );
        });
    }
    function updateManagers() {
      inquirer
        .prompt([
          {
            type: "list",
            message: "Which [EMPLOYEE] would you like to update: ",
            choices: employeeArr,
            name: "employee",
          },
          {
            type: "list",
            message: "Select the updated Manager:",
            choices: managerArr,
            name: "manager",
          },
        ])
        .then(function (answer) {
          let employeeID;
          for (i = 0; i < employeeArr.length; i++) {
            if (answer.employee == employeeArr[i].name) {
              employeeID = employeeArr[i].id;
            }
          }
          let managerID;
          for (i = 0; i < managerArr.length; i++) {
            if (answer.manager == managerArr[i].name) {
              managerID = managerArr[i].id;
            }
          }
          connection.query(
            "UPDATE employee SET manager_id= ? WHERE id= ?",
            [managerID, employeeID],
            function (err, res) {
              if (err) throw err;
              console.table("updated employee");
              runSearch();
            }
          );
        });
    }
  
  function add() {
    inquirer
      .prompt([
        {
          type: "list",
          message: "What are you adding?",
          choices: ["Department","Employee","Role"],
          name: "add_type",
        },
      ])
      .then(function (input) {
        console.log("User selected " + input.add_type);
  
        if (input.add_type === "Depart") {
          addDepart();
        } else if (input.add_type === "Employee") {
          addEmployee();
        } else if (input.add_type === "Role") {
          addRole();
        }
      });
  }
  function addDepart() {
      inquirer
        .prompt([
          {
            type: "input",
            message: "What department would you like to add?",
            choices: departArr,
            name: "depart",
          },
        ])
        .then(function (answer) {
          for (i = 0; i < departArr.length; i++) {
            if (answer.depart == departArr[i].name) {
              depart = departArr[i].id;
            }
          }
          connection.query(
            "INSERT INTO department (name) VALUES (?)",
            [answer.depart],
            function (err, res) {
              if (err) throw err;
              console.table("Department Added");
              runSearch();
            }
          );
        });
  }
  
  function addEmployee() {
    inquirer
      .prompt([
          {
          type: "list",
          message: "What is their role?",
          choices: roleArr,
          name: "startingRole",
          }, 
        {
          type: "input",
          message: "What is employee's first name?",
          name: "first_name",
        },
        {
          type: "input",
          message: "What is employee's last name?",
          name: "last_name",
        },
      ])
      .then(function (answer) {
        let roleID;
        for (i = 0; i < roleArr.length; i++) {
          if (answer.startingRole == roleArr[i].name) {
            roleID = roleArr[i].id;
          }
        }
  
        let manager;
        for (i = 0; i < managerArr.length; i++) {
          if (answer.manager == managerArr[i].name) {
            manager = managerArr[i].id;
          }
        
        }
        connection.query(
          "INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)",
          [answer.first_name, answer.last_name, roleID, manager],
          function (err, res) {
            if (err) throw err;
            console.table("Employee Added");
            runSearch();
          }
        );
      });
  }
  
  function addRole() {
    inquirer
      .prompt([
        {
          type: "input",
          message: "What new role are you wishing to create?",
          name: "role",
        },
        {
          type: "list",
          message: "What department will this role be in?",
          choices: departArr,
          name: "depart",
        },
        {
          type: "input",
          message: "What is the salary of this role?",
          name: "salary",
        },      
      ])
      .then(function (answer) {
        for (i = 0; i < departArr.length; i++) {
          if (answer.depart == departArr[i].name) {
            depart = departArr[i].id;
          }
        }
        connection.query(
          "INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)",
          [answer.role, answer.salary, depart],
          function (err, res) {
            if (err) throw err;
            console.log("Role Created");
            runSearch();
          }
        );
      });
  }
  
  
  
  
  
  function deleteInfo() {
    inquirer
      .prompt([
        {
          type: "list",
          message: "What information would you like to delete",
          choices: ["Department", "Employee", "Role"],
          name: "deleteSelected",
        },
      ])
      .then(function (input) {
        console.log("User selected " + input.deleteSelected);
  
        if (input.deleteSelected === "Department") {
          deleteDepart();      
        } else if (input.deleteSelected === "Employee") {
          deleteEmploy();
      } else if (input.deleteSelected === "Role") {
          deleteRole();
        }
      });
  }
  function deleteDepart() {
      inquirer
        .prompt([
          {
            type: "list",
            message: "What department is being dismissed?",
            choices: departArr,
            name: "departmentShutdown",
          },
        ])
        .then(function (answer) {
            connection.query(
            "DELETE FROM department WHERE id= ?",
            [answer.departID],
            function (err, res) {
              if (err) throw err;
              console.table("Department Dismissed");
              runSearch();
            }
          );
        });
    }
  
  function deleteEmploy() {
    inquirer
      .prompt([
        {
          type: "list",
          message: "Which employee would you like to let go?",
          choices: employeeArr,
          name: "canned",
        },
      ])
      .then(function (answer) {
        connection.query(
          "DELETE FROM employee WHERE last_name= ?",
          [answer.canned],
          function (err, res) {
            if (err) throw err;
            console.table("deleted employee");
            runSearch();
          }
        );
      });
  }
  
  function deleteRole() {
    inquirer
      .prompt([
        {
          type: "list",
          message: "What role would you like to delete",
          choices: roleArr,
          name: "roleRemoval",
        },
      ])
      .then(function (answer) {
          connection.query(
          "DELETE FROM role WHERE id= ?",
          [answer.roleID],
          function (err, res) {
            if (err) throw err;
            console.table("Role Removed");
            runSearch();
          }
        );
      });
  }
  