function Role(id, name) {
    var id;
    var name;
    this.getId = () => id;
    this.setId = (pId) => id = pId;
    this.getName = () => name;
    this.setName = (pName) => name = pName;
}
exports.Role = Role;