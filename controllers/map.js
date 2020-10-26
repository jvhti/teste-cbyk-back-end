'use strict';

function getRandomInteger(max) {
    return Math.floor(Math.random() * max);
}

module.exports = function (router) {

    router.get('/generate', function (req, res) {
        const {width, height, airportsCount, cloudsCount} = req.query;

        console.log(width, height, airportsCount, cloudsCount);

        const initialMap = [];
        let airports = [];
        let clouds = [];

        for (let y = 0; y < height; ++y) {
            const row = [];
            for (let x = 0; x < width; ++x) {
                row.push('.');
            }
            initialMap[y] = row;
        }

        for (let i = 0; i < airportsCount; ++i) {
            const x = getRandomInteger(width);
            const y = getRandomInteger(height);

            if (initialMap[y][x] !== '.') {
                --i;
                continue;
            }

            initialMap[y][x] = 'A';
            airports.push([y, x]);
        }

        for (let i = 0; i < cloudsCount; ++i) {
            const x = getRandomInteger(width);
            const y = getRandomInteger(height);

            if (initialMap[y][x] !== '.') {
                --i;
                continue;
            }

            initialMap[y][x] = '*';
            clouds.push([y, x]);
        }

        const updateMap = (curMap, y, x, newClouds) => {
            if (curMap[y][x] === '*') return;
            curMap[y][x] = '*';
            newClouds.push([y, x]);
        };

        const maps = [initialMap];

        let days = 1;
        let dayOfFirst = 0;

        while (airports.length > 0) {
            const curMap = [];

            for (let i = 0; i < height; ++i)
                curMap[i] = maps[maps.length - 1][i].slice();


            let newClouds = [];
            const removeCloud = [];
            clouds.forEach(([y, x]) => {
                if (y - 1 >= 0)
                    updateMap(curMap, y - 1, x, newClouds);
                if (y + 1 < height)
                    updateMap(curMap, y + 1, x, newClouds);
                if (x - 1 >= 0)
                    updateMap(curMap, y, x - 1, newClouds);
                if (x + 1 < width)
                    updateMap(curMap, y, x + 1, newClouds);
                removeCloud.push([y, x]);
            });

            clouds = clouds.filter((cloud) => removeCloud.findIndex((c) => cloud[0] === c[0] && cloud[1] === c[1]) === -1);
            newClouds = newClouds.filter((cloud) => clouds.findIndex((c) => cloud[0] === c[0] && cloud[1] === c[1]) === -1);

            clouds = clouds.concat(newClouds);

            const removeAirport = [];
            airports.forEach(([y, x]) => {
                if (curMap[y][x] === 'A') return;
                removeAirport.push([y, x]);
                if (dayOfFirst === 0)
                    dayOfFirst = days;
            });

            airports = airports.filter((airport) => removeAirport.findIndex((a) => airport[0] === a[0] && airport[1] === a[1]) === -1);

            ++days;
            maps.push(curMap);
        }


        res.json({
            maps,
            dayOfFirst,
            dayForAll: days - 1
        });

    });

};
