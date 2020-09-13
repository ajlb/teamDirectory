const Manager = require("./lib/Manager");
const Engineer = require("./lib/Engineer");
const Intern = require("./lib/Intern");
const inquirer = require("inquirer");
const path = require("path");
const fs = require("fs");

const OUTPUT_DIR = path.resolve(__dirname, "output");
const outputPath = path.join(OUTPUT_DIR, "team.html");

const render = require("./lib/htmlRenderer");

// variables
var newName = "";
var newID = "";
var newEmail = "";
var newRole  = "";
var newSpecific = "";

var teamMembers = [];

const questions = [
    {
        type: "input",
        name: "name",
        message: "What is the team member's name?\n",
        validate: (text) => (
            (/[A-Za-z]/.test(text)) ? true : "Names should consist of letters only. Please try again"
        )
    },
    {
        type: "input",
        name: "id",
        message: "What is the team member's numeric ID?\n",
        default: 001,
        validate: (input) => (
            (/[0-9]/.test(input)) ? true : "Please enter a numeric value."
        )
    },
    {
        type: "input",
        name: "email",
        message: "What is the employee's email address?\n",
        default: () => "foo@foo.com",
        validate: (text) => (
            (/@/.test(text)) ? true : "Hmm that doesn't apear to be an email address, try again."
        )
    },
    {
        type: "list",
        name: "role",
        message: "What is the employee's role?\n",
        default: "Employee",
        choices: [
            "Engineer",
            "Intern",
            "Manager"
        ],
        validate: (text) => (
            (text !== "Employee") ? true : "Please make a selection."
        )
    },
    {
        type: "input",
        name: "officeNumber",
        message: "What is the manager's office number?\n",
        when: (answers) => answers.role === "Manager"
    },
    {
        type: "input",
        name: "github",
        message: "What is their GitHub username?\n",
        when: (answers) => answers.role === "Engineer"
    },
    {
        type: "input",
        name: "school",
        message: "What school is the intern currently attending?\n",
        when: (answers) => answers.role === "Intern"
    }
]

// Initiate the program
console.log(`
==============================================================
                        Team Directory
Follow on screen prompts to add members to your project team
==============================================================
==============================================================
                        New Team Member
==============================================================
`);
getStarted();

function getStarted () {
    inquirer.prompt(questions).then (function (responses){
        getEmployeeBasics(responses);
    });
}

// inquirer questions
async function getEmployeeBasics (responses) {
    
    newName = responses.name;
    newID = responses.id;
    newEmail = responses.email;
    newRole = responses.role;
    switch (newRole) {
        case "Manager":
            newSpecific = responses.officeNumber;
            break;
        case "Engineer":
            newSpecific = responses.gihub;
            break;
        case "Intern":
            newSpecific = responses.school;
            break;
        default:
            newSpecific = "Employee";
    }
    wrapUpInput();

}

// //Manager Specific Input
// function getManagerInput() {
//     inquirer
//     .prompt([
        
//     ]).then(function({ officeNumber }){
//         newSpecific = officeNumber;
//         wrapUpInput();
//     });
// }

// //Engineer Specific Input
// function getEngineerInput() {
//     inquirer
//     .prompt([
        
//     ]).then(function({ github }){
//         newSpecific = github;
//         wrapUpInput();
//     });    
// }

// //Intern Specific Input
// function getInternInput() {
//     inquirer
//     .prompt([
//         {
//             type: "input",
//             name: "school",
//             message: "What school is the intern currently attending?\n"
//         }
//     ]).then(function({ github }){
//         newSpecific = github;
//         wrapUpInput();
//     });    
// }

function wrapUpInput() {
    makeEmployeeObject();
    inquirer
    .prompt([
        {
            type: 'list',
            message: "Do you want to add Another Team Member?",
            choices: ["Yes", "No"],
            name: "choice"
        }]).then(function({ choice }) {
            if (choice === "Yes") {
                console.log(`
    ==============================================================
                        New Team Member
    ==============================================================
                `);
                getStarted();
            } else {
                getHTML();
            }
    });
}


function makeEmployeeObject () {
    switch (newRole) {
        case "Manager":
            var newManager = new Manager(newName, newID, newEmail, newSpecific);
            teamMembers.push(newManager);
            break;
        case "Engineer":
            const newEngineer = new Engineer(newName, newID, newEmail, newSpecific);
            teamMembers.push(newEngineer);
            break;
        case "Intern":
            const newIntern = new Intern(newName, newID, newEmail, newSpecific);
            teamMembers.push(newIntern);
    }
}

async function getHTML() {
    try {
        const newHTML = await render(teamMembers);
        createHTML(newHTML);
    } catch {
        console.log ("Error rendering HTML.")
    }
}

function createHTML(newHTML) {
    fs.writeFile(outputPath, newHTML, function(err) {
        if (err) {
            return console.log(err);
        }
        console.log(`
==============================================================
                Team Assembled Successfully!
  You can find your Team Directory in the output folder
==============================================================
        `);
    });
}