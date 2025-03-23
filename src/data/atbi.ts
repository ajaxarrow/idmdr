import { ATBI } from "../interfaces/atbi.interface.ts";

const atbiData: ATBI[] = [{
    uid: "mushroom-city",
    name: "Mushroom City Company",
    description: `<p>Mushroom City is an agri-tourism site and training center for mushroom production technology. It envisioned becoming the country's premier agri-tourism site and training hub, showcasing smart-farming technologies.</p><p>The enterprise started with a P6,000.00 start-up capital from the piggy banks of the brothers Numeriano \"Ted\" and Edsel \"Bong\" Quemado. Ted, a graduate of BS in Agriculture majoring in Plant Pathology at CMU, initiated the engagement in mushroom production. He obtained his knowledge of the technology from his undergraduate thesis, which dealt with mushroom production. On the other hand, Bong is taking up a Bachelor of Science in Financial Management at Bukidnon State University. While Ted is the technology expert, Bong oversees their enterprise's marketing and administrative side.</p><p>Their mushroom production venture started at home, and their initial market was their neighbors and friends. Their father gave them more than one-hectare land in Purok 8, Kalasungay, Malaybalay City. This is where they established the Mushroom City Company on November 12, 2019. Mushroom City produces fresh and processed mushroom and fruiting bags. They have mushroom houses that can grow 60 Kg of fresh mushrooms daily. The processed mushroom includes mushroom chicharon, which comes in different flavors and mushroom delicacies. As part of their expansion, in September 2022, the Mushroom Café was established, which serves coffee and mushroom delicacies.</p>`,
    owner: [
        "Numeriano O. Quemado III",
        "Edsel James O. Quemado Jr."
    ],
    mobile: "0905 103 3365",
    email: "mushroomcitybukidnon@gmail.com",
    facebook: "Mushroom City - https://www.facebook.com/bukidnonmushroomss?mibextid=ZbWKwL",
    facilities: [
        {
            name: "Mushroom House",
            capacity: "60 Kg daily production",
            description: "Specialized facility for growing fresh mushrooms with controlled environment"
        },
        {
            name: "Bagging Area",
            capacity: "500 bags daily",
            description: "Area for preparing and filling substrate bags for mushroom cultivation"
        },
        {
            name: "Fruiting Bags Stock Room",
            capacity: "2000 bags",
            description: "Temperature-controlled storage facility for mushroom fruiting bags"
        },
        {
            name: "Laboratory",
            capacity: "100 sqm",
            description: "Sterile environment for mushroom spawn production and research"
        },
        {
            name: "Food Processing Facility",
            capacity: "50 Kg daily processing",
            description: "Facility for converting fresh mushrooms into various processed products"
        },
        {
            name: "Bee Farm",
            capacity: "10 colonies",
            description: "Apiary producing honey and supporting pollination"
        },
        {
            name: "Vermicomposting",
            capacity: "500 Kg monthly",
            description: "Organic waste recycling system using earthworms to create fertilizer"
        },
        {
            name: "Mushroom café",
            capacity: "30 persons",
            description: "On-site café serving coffee and various mushroom-based delicacies"
        },
        {
            name: "Training Center",
            capacity: "50 persons",
            description: "Educational facility for workshops and seminars on mushroom cultivation"
        },
        {
            name: "Campsite",
            capacity: "100 persons",
            description: "Outdoor recreational area for visitors and agri-tourism activities"
        }
    ],
    products: [
        {
            uid: "mushroom-chicharon",
            name: "Mushroom Chicharon - Original flavor (Wholesale)",
            description: "Deep-fried Oyster Mushroom in batter mix, seasoned with salt and pepper.",
            price: 40,
            unit: "50 grams"
        },
        {
            uid: "mushroom-chicharon-original",
            name: "Mushroom Chicharon - Original flavor (Wholesale)",
            description: "Deep-fried Oyster Mushroom in batter mix, seasoned with salt and pepper.",
            price: 80,
            unit: "100 grams"
        },
        {
            uid: "mushroom-chicharon-bbq-retail",
            name: "Mushroom Chicharon - BBQ flavor (Retail)",
            description: "Deep-fried Oyster Mushroom blended in barbecue flavor.",
            price: 40,
            unit: "50 grams"
        },
        {
            uid: "mushroom-chicharon-bbq-wholesale",
            name: "Mushroom Chicharon - BBQ flavor (Wholesale)",
            description: "Deep-fried Oyster Mushroom blended in barbecue flavor.",
            price: 80,
            unit: "100 grams"
        },
        {
            uid: "mushroom-chicharon-sour-cream-retail",
            name: "Mushroom Chicharon - Sour cream flavor (Retail)",
            description: "Deep-fried Oyster Mushroom blended in sour cream flavor.",
            price: 40,
            unit: "50 grams"
        },
        {
            uid: "mushroom-chicharon-sour-cream-wholesale",
            name: "Mushroom Chicharon - Sour cream flavor (Wholesale)",
            description: "Deep-fried Oyster Mushroom blended in sour cream flavor.",
            price: 80,
            unit: "100 grams"
        },
        {
            uid: "mushroom-chicharon-original-retail",
            name: "Mushroom Chicharon - Original flavor (Retail)",
            description: "Deep-fried Oyster Mushroom in batter mix, seasoned with salt and pepper.",
            price: 100,
            unit: "100 grams"
        },
        {
            uid: "fruiting-bags",
            name: "Fruiting Bags",
            description: "Growing bags for mushroom, enclosed in Polypropylene (PP) a type of \"thermoplastic\" commonly used in mushroom cultivation. It has the ability to hold mushroom substrates weighted 800 grams to 1 kilo.",
            price: 25,
            unit: "800g"
        },
        {
            uid: "fruiting-bags-1kg",
            name: "Fruiting Bags",
            description: "Growing bags for mushroom, enclosed in Polypropylene (PP) a type of \"thermoplastic\" commonly used in mushroom cultivation. It has the ability to hold mushroom substrates weighted 800 grams to 1 kilo.",
            price: 35,
            unit: "kilo"
        },
        {
            uid: "oyster-mushroom",
            name: "Fresh Oyster Mushroom",
            description: "Pleurotus ostreatus or also known as Oyster Mushroom a variety grown in a mushroom fruiting bags pack in a disposable styrofoam available P200.00 per kilogram.",
            price: 200,
            unit: "kilo"
        }
    ],
    additionalInfo: `<h3>Company Logo</h3><p>https://drive.google.com/drive/folders/1MDNtmOlUStfg5r_m0PPDfJxXqDj8ba2L?usp=share_link</p><h3>Pictures</h3><p>https://drive.google.com/drive/folders/1MDWtEtvcUWNRRqi2MAiBWBr3Zrdw8EAh?usp=share_link</p><h3>Product Images</h3><p>https://drive.google.com/drive/folders/1c54uBA4d0etHNcIdKKSTOsrks-hI6e43?usp=share_link</p><h3>Facility Images</h3><p>https://drive.google.com/drive/folders/1QvE-GIsopPbjRF7vo6gV2MZrgKuQTauc?usp=share_link</p><h3>Facebook Pages</h3><ul><li>Mushroom City: https://www.facebook.com/bukidnonmushroomss?mibextid=ZbWKwL</li><li>The Mushroom Café: https://www.facebook.com/TheMushroomCafebyMushroomCity?mibextid=ZbWKwL</li></ul><h3>Linkages</h3><ol><li>Department of Science and Technology (DOST)</li><li>Philippine Council for Agriculture, Aquatic and Natural Resources Research and Development (PCAARRD)</li><li>Central Mindanao University-Technology Business Incubator</li><li>Agricultural Training Institute</li><li>Department of Agriculture</li><li>Bukidnon State University</li><li>Department of Trade and Industry</li><li>Provincial Agriculture Office</li></ol><h3>Awards</h3><ul><li>2019 - DA-ATI Learning Site</li><li>2020 - Most Outstanding Regional Organic Young Farmer</li><li>2021 - Tesda Accredited Farm School</li><li>2022 - Villar Sipag award for Youth Poverty Reduction Challenge</li><li>2022 - Provincial Gawad Saka winner (young farmers category)</li></ul><h3>Certificates</h3><p>https://drive.google.com/drive/folders/1mrvGSeR3iHT_skWCSaviCvZmfzOvd35I?usp=share_link</p><h3>Location</h3><p>https://goo.gl/maps/j8LrA8MDwyDr7K639</p>`
}];

export default atbiData;