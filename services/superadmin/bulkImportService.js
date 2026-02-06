const xlsx = require('xlsx');
const db = require('../../models');
const { Employee, Department, Designation, Role } = db;
const { Op } = require('sequelize');

/**
 * Process bulk update from Excel buffer
 * @param {Buffer} fileBuffer 
 */
exports.processBulkUpdate = async (fileBuffer) => {
    const workbook = xlsx.read(fileBuffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const data = xlsx.utils.sheet_to_json(sheet);

    if (!data || data.length === 0) {
        throw new Error('No data found in the uploaded file');
    }

    const results = {
        total: data.length,
        updated: 0,
        failed: 0,
        errors: []
    };

    // Pre-fetch lookups to optimize performance
    const departments = await Department.findAll();
    const designations = await Designation.findAll();
    // const roles = await Role.findAll(); // specific roles if needed

    for (const [index, row] of data.entries()) {
        try {
            // Identify user by EmpId or Email
            let employee = null;
            const empId = row['EmpId'] || row['Employee Id'] || row['EmployeeID'] || row['id'];
            const email = row['Email'] || row['email'];

            if (empId) {
                employee = await Employee.findOne({ where: { EmpId: empId.toString() } });
            }

            if (!employee && email) {
                employee = await Employee.findOne({ where: { Email: email } });
            }

            if (!employee) {
                results.failed++;
                results.errors.push(`Row ${index + 2}: Employee not found (EmpId: ${empId}, Email: ${email})`);
                continue;
            }

            // Prepare update data
            const updateData = {};

            // Helper to get value case-insensitively from row
            const getVal = (keys) => {
                for (const key of keys) {
                    if (row[key] !== undefined) return row[key];
                }
                return undefined;
            };

            // Basic Fields
            const firstName = getVal(['FirstName', 'First Name', 'firstname']);
            if (firstName) updateData.FirstName = firstName;

            const lastName = getVal(['LastName', 'Last Name', 'lastname']);
            if (lastName) updateData.LastName = lastName;

            const phone = getVal(['MobileNo', 'MobileNo1', 'Phone', 'Contact Number']);
            if (phone) updateData.MobileNo1 = phone;

            const mobile2 = getVal(['MobileNo2', 'Alternate Phone']);
            if (mobile2) updateData.MobileNo2 = mobile2;

            const dob = getVal(['Birthdate', 'DOB', 'Date of Birth']);
            if (dob) updateData.Birthdate = new Date(dob);

            const joiningDate = getVal(['JoiningDate', 'DOJ', 'Date of Joining']);
            if (joiningDate) updateData.Joiningdate = new Date(joiningDate);

            const bankAccount = getVal(['BankAccountNo', 'Bank Account']);
            if (bankAccount) updateData.BankAccountNo = bankAccount;

            const bankName = getVal(['BankName', 'Bank Name']);
            if (bankName) updateData.BankName = bankName;

            // Department Lookup
            let deptVal = getVal(['Department', 'DepartmentId', 'Department Name']);
            if (deptVal) {
                if (!isNaN(parseInt(deptVal))) {
                    updateData.DepartmentId = parseInt(deptVal);
                } else {
                    const dept = departments.find(d => d.DepartmentName.toLowerCase() === deptVal.toString().toLowerCase());
                    if (dept) updateData.DepartmentId = dept.Id;
                }
            }

            // Designation Lookup
            let desigVal = getVal(['Designation', 'DesignationId', 'Designation Name']);
            if (desigVal) {
                if (!isNaN(parseInt(desigVal))) {
                    updateData.DesignationId = parseInt(desigVal);
                } else {
                    const desig = designations.find(d => d.DesignationName.toLowerCase() === desigVal.toString().toLowerCase());
                    if (desig) updateData.DesignationId = desig.Id;
                }
            }

            // Password update (optional)
            const password = getVal(['Password']);
            if (password) updateData.Password = password; // Should hash in real app if using bcrypt

            // Unit, Zone, Location (assuming passed as strings or IDs)
            const unit = getVal(['Unit']);
            if (unit) updateData.Unit = unit;

            const zone = getVal(['Zone']);
            if (zone) updateData.Zone = zone;

            const location = getVal(['Location']);
            if (location) updateData.Location = location;

            const category = getVal(['Category']);
            if (category) updateData.Category = category;

            // Perform Update
            await employee.update(updateData);
            results.updated++;

        } catch (error) {
            results.failed++;
            results.errors.push(`Row ${index + 2}: Error - ${error.message}`);
        }
    }

    return results;
};
