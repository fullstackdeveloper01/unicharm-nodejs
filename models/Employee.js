const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Employee = sequelize.define('Employee', {
  Id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  FirstName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  LastName: {
    type: DataTypes.STRING,
    allowNull: true
  },
  DepartmentId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'Departments',
      key: 'Id'
    }
  },
  DesignationId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'Designations',
      key: 'Id'
    }
  },
  RoleId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'Roles',
      key: 'Id'
    }
  },
  Birthdate: {
    type: DataTypes.DATE,
    allowNull: true
  },
  MobileNo1: {
    type: DataTypes.STRING,
    allowNull: true
  },
  MobileNo2: {
    type: DataTypes.STRING,
    allowNull: true
  },
  Email: {
    type: DataTypes.STRING,
    allowNull: true,
    validate: {
      isEmail: true
    }
  },
  Joiningdate: {
    type: DataTypes.DATE,
    allowNull: true
  },
  UserPhoto: {
    type: DataTypes.STRING,
    allowNull: true
  },
  UserName: {
    type: DataTypes.STRING,
    allowNull: true
  },
  Password: {
    type: DataTypes.STRING,
    allowNull: true
  },
  CreatedOn: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  IsDeleted: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  EmpId: {
    type: DataTypes.STRING,
    allowNull: true
  },
  Category: {
    type: DataTypes.STRING,
    allowNull: true
  },
  Unit: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'Units',
      key: 'Id'
    }
  },
  Zone: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'Zones',
      key: 'Id'
    }
  },
  Location: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'Locations',
      key: 'Id'
    }
  },
  State: {
    type: DataTypes.STRING,
    allowNull: true
  },
  City: {
    type: DataTypes.STRING,
    allowNull: true
  },
  SupervisorEmpId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'Employees',
      key: 'Id'
    }
  },
  BankAccountNo: {
    type: DataTypes.STRING,
    allowNull: true
  },
  BankName: {
    type: DataTypes.STRING,
    allowNull: true
  },
  IfscCode: {
    type: DataTypes.STRING,
    allowNull: true
  },
  ExpenseDepartment: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'Designations',
      key: 'Id'
    }
  },
  UserType: {
    type: DataTypes.STRING,
    allowNull: true
  },
  TTMT: {
    type: DataTypes.STRING,
    allowNull: true
  },
  SecretaryId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'Employees',
      key: 'Id'
    }
  }
}, {
  tableName: 'Employees',
  timestamps: false
});

module.exports = Employee;
