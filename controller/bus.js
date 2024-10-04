const BusRoute = require("../model/bus-route");

async function handleAddNewBusRoute(req, res) {
    const { routeNu, stops, busImg } = req.body;

    try {
        const bus = await BusRoute.findOne({ routeNu });
        console.log(bus);

        if (bus) {
            return res.status(400).json({ msg: "Bus route already exists" });
        }

        const NewBusRoute = await BusRoute.create({
            routeNu,
            stops,
            busImg
        });

        return res.status(200).json({ msg: "Bus Route Registered successfully", NewBusRoute });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ msg: 'Server error while adding new bus' });
    }
};

async function handleUpdateBusRoute(req, res) {
    const { routeNu } = req.params;
    const { newRouteNu, stops, busImg } = req.body;

    try {
        let busRoute = await BusRoute.findOne({ routeNu });

        if (!busRoute) {
            return res.status(404).json({ msg: 'Bus route not found' });
        }

        if (newRouteNu) busRoute.routeNu = newRouteNu;
        if (stops) busRoute.stops = stops;
        if (busImg) busRoute.busImg = busImg;

        await busRoute.save();

        return res.status(200).json({ msg: 'Bus route updated successfully', busRoute });
    } catch (err) {
        console.error(err.message);
        return res.status(500).json({ msg: 'Server error while updating bus route' });
    }
};

async function handleDeleteBusRoute(req, res) {
    const { routeNu } = req.params;

    try {
        const deletedBusRoute = await BusRoute.findOneAndDelete({ routeNu });

        if (!deletedBusRoute) {
            return res.status(404).json({ msg: 'Bus route not found' });
        }

        return res.status(200).json({ msg: 'Bus route deleted successfully', deletedBusRoute });
    } catch (err) {
        console.error(err.message);
        return res.status(500).json({ msg: 'Server error while deleting bus route' });
    }
};

async function handleFindBus(req, res) {
    const { source, destination } = req.body;

    try {
        const busRoutes = await BusRoute.find({
            stops: {
                $all: [
                    new RegExp(source, 'i'),
                    new RegExp(destination, 'i')
                ]
            }
        }).then((routes) => {
            return routes.filter(route => {
                const sourceIndex = route.stops.findIndex(stop => stop.toLowerCase() === source.toLowerCase());
                const destinationIndex = route.stops.findIndex(stop => stop.toLowerCase() === destination.toLowerCase());

                return sourceIndex !== -1 && destinationIndex !== -1 && sourceIndex < destinationIndex;
            });
        });

        if (busRoutes.length === 0) {
            return res.status(404).json({ msg: 'No bus routes found for the given source and destination.' });
        }

        return res.status(200).json(busRoutes);
    } catch (error) {
        console.error(error.message);
        return res.status(500).json({ msg: 'Server error while finding buses' });
    }
};

async function getAllBuses(req, res) {
    try {
        const busRoutes = await BusRoute.find();
        res.status(200).json(busRoutes);
    } catch (error) {
        console.error(error.message);
        res.status(500).json({ msg: 'Server error while fetching bus routes' });
    }
};

async function handleSearchSuggestion(req, res) {
    const { q } = req.body;

    try {
        const busRoutes = await BusRoute.find({
            stops: { $regex: new RegExp(`^${q}`, 'i') }
        });

        const matchingStops = busRoutes.flatMap(route =>
            route.stops.filter(stop => new RegExp(`^${q}`, 'i').test(stop))
        );

        const uniqueStops = [...new Set(matchingStops)];
        res.json(uniqueStops);
    } catch (error) {
        res.status(500).json({ msg: 'Server error while fetching suggestions' });
    }
};

module.exports = {
    handleAddNewBusRoute,
    handleUpdateBusRoute,
    handleDeleteBusRoute,
    handleFindBus,
    getAllBuses,
    handleSearchSuggestion
}