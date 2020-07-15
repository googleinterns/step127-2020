/**
 * Generates a sample restaurant using the specified name and id.
 *
 * @param {string=} name An optional name for the generated 
 *     restaurant (default: 'Olive Garden Italian Restaurant').
 * @param {string=} id An optional id for the generated 
 *     restaurant (default: 'ChIJrRKLs5c5tokR2F3Oal2td04').
 */
function generateRestaurant(
  name = 'Olive Garden Italian Restaurant',
  id = 'ChIJrRKLs5c5tokR2F3Oal2td04'
) {
  return {
    hash: 123456789,
    key: {
      address: '45970 Waterview Plaza, Sterling, VA 20166, United States',
      avgRating: 4.2,
      id: id,
      latLngCoords: {
        lat: 39.033242,
        lng: -77.410246
      },
      name: name,
      numRatings: 1458,
      placeTypes: ['meal_takeaway', 'restaurant'],
      priceLevel: 2,
    },
    value: 0.9199800399201596,
  };
}

export default generateRestaurant;
