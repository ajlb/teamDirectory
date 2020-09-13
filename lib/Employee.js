// TODO: Write code to define and export the Employee class
class Employee {
    constructor (name, id, email){
        this.id = id;
        this.name = name;
        this.email = email;
    }

    getName = () => this.name;
    getId = () => this.id;
    getEmail = () => this.email;
    getRole = () => "Employee";
}


module.exports = Employee;