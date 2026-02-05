const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Employee = sequelize.define('Employee', {
  Id: {
    type: DataTypes.BIGINT,
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
    type: DataTypes.BIGINT,
    allowNull: true,
    references: {
      model: 'Departments',
      key: 'Id'
    }
  },
  DesignationId: {
    type: DataTypes.BIGINT,
    allowNull: true,
    references: {
      model: 'Designation',
      key: 'Id'
    }
  },
  RoleId: {
    type: DataTypes.BIGINT,
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
    type: DataTypes.TEXT, // longtext
    allowNull: true
  },
  UserName: {
    type: DataTypes.STRING(20),
    allowNull: true
  },
  Password: {
    type: DataTypes.STRING(20),
    allowNull: true
  },
  DeviceId: {
    type: DataTypes.TEXT, // longtext
    allowNull: true
  },
  LoginToken: {
    type: DataTypes.STRING(500),
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
    type: DataTypes.STRING,
    allowNull: true
  },
  Zone: {
    type: DataTypes.STRING,
    allowNull: true
  },
  Location: {
    type: DataTypes.STRING,
    allowNull: true
  },
  State: {
    type: DataTypes.STRING,
    allowNull: true
  },
  City: {
    type: DataTypes.STRING,
    allowNull: true
  },
  Supervisor: {
    type: DataTypes.STRING,
    allowNull: true
  },
  SupervisorEmpId: {
    type: DataTypes.STRING,
    allowNull: true
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
    type: DataTypes.STRING,
    allowNull: true
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
    type: DataTypes.BIGINT,
    allowNull: true
  }
}, {
  tableName: 'Employees',
  timestamps: false
});

// Static method to get upcoming birthdays
Employee.getUpcomingBirthdays = async function () {
  const query = `
      SELECT 
        Id,
        FirstName,
        LastName,
        Birthdate,
        UserPhoto,
        DesignationId,
        DepartmentId
      FROM Employees
      WHERE 
        IsDeleted = 0 AND
        Birthdate IS NOT NULL AND
        (
          (MONTH(Birthdate) = MONTH(CURRENT_DATE()) AND DAY(Birthdate) >= DAY(CURRENT_DATE()))
          OR
          (MONTH(Birthdate) = MONTH(DATE_ADD(CURRENT_DATE(), INTERVAL 1 MONTH)))
        )
      ORDER BY 
        CASE 
          WHEN MONTH(Birthdate) = MONTH(CURRENT_DATE()) THEN 0 
          ELSE 1 
        END,
        DAY(Birthdate)
      LIMIT 10;
    `;

  const results = await sequelize.query(query, {
    type: sequelize.QueryTypes.SELECT
  });

  // Prepend base URL to UserPhoto
  const baseUrl = process.env.BASE_URL || 'https://uciaportal-node.manageprojects.in';
  return results.map(emp => {
    if (emp.UserPhoto && emp.UserPhoto.trim() !== '' && !emp.UserPhoto.startsWith('http')) {
      // Handle bare filenames
      if (!emp.UserPhoto.startsWith('/') && !emp.UserPhoto.includes('/')) {
        if (emp.UserPhoto.startsWith('profile-')) {
          emp.UserPhoto = `/uploads/profile/${emp.UserPhoto}`;
        } else {
          emp.UserPhoto = `/Images/Profile/${emp.UserPhoto}`;
        }
      }

      const path = emp.UserPhoto.startsWith('/') ? emp.UserPhoto : `/${emp.UserPhoto}`;
      emp.UserPhoto = `${baseUrl}${path}`;
    }

    // Generate Initials
    const firstName = emp.FirstName || '';
    const lastName = emp.LastName || '';
    const firstInitial = firstName ? firstName.charAt(0).toUpperCase() : '';
    const lastInitial = lastName ? lastName.charAt(0).toUpperCase() : '';
    emp.initials = `${firstInitial}${lastInitial}`;

    return emp;
  });
};

module.exports = Employee;
