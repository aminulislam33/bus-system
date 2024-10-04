const express = require('express');
const {handleAddNewBusRoute, handleFindBus, handleUpdateBusRoute, handleDeleteBusRoute, getAllBuses, handleSearchSuggestion} = require('../controller/bus');
const verifyToken = require('../utils/verifyToken');
const authorizeRoles = require('../utils/checkAdmin');

const router = express.Router();

router.use(verifyToken);

router.get('/', getAllBuses);
router.post('/find', handleFindBus);
router.post('/suggest', handleSearchSuggestion);

router.use(authorizeRoles(['admin']));

router.post('/add', handleAddNewBusRoute);
router.put('/update/:routeNu', handleUpdateBusRoute);
router.delete('/delete/:routeNu', handleDeleteBusRoute);

module.exports = router;