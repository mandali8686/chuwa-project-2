const express = require('express');
const router = express.Router();
const employeeController = require('../controllers/Employees');


router.get('/', employeeController.getAllEmployees);
router.get('/:id', employeeController.getEmployeeById);
router.post('/', employeeController.createEmployee);
router.put('/:id', employeeController.updateEmployee);
router.patch('/:id', employeeController.updateEmployeePart);
router.delete('/:id', employeeController.deleteEmployee);

module.exports = router;
