const Employee = require("./Employee");

//Engineer Class inherits from Employee, initializes with additional argument github, has function getGithub
class Engineer extends Employee {
    constructor(name, id, email, github){
        super(name, id, email);
        this.github = github;
    }

    getRole = () => "Engineer";

    getGithub = () => this.github;
    
}

module.exports = Engineer;