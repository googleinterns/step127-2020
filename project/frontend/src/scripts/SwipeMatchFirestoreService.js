class SwipeMatchService {
  static SESSION_COLLECTION_NAME = 'swipe-match-sessions';
  static USER_COLLECTION_NAME = 'users';

  static async generateGroupId() {
    const response = await fetch('/api/swipe-match/generate-group-id');
    if (response.ok) {
      const data = await response.json();
      return data.groupId;
    } else {
      throw new Error('Server responded with error');
    }
  }

  static fetchRestaurants(placesService, location, dispatch) {
    const searchRequest = {
      location: location,
      type: 'restaurant',
      keyword: 'restaurant',
      rankBy: window.google.maps.places.RankBy.DISTANCE,
    };

    placesService.nearbySearch(searchRequest, (results, status, pagination) => {
      dispatch({
        type: 'set restaurants',
        payload: results.map((result, index) => ({
          key: {
            ...result,
            id: result.place_id,
            avgRating: result.rating,
            numRatings: result.user_ratings_total,
            priceLevel: result.price_level,
            placeTypes: result.types,
          },
          fractionLiked: 0.0,
          gradient: index % 3,
        })),
      });
    });
  }

  static async fetchCreatorCurrentSwipeMatchSession(firestore, user) {
    const doc = await firestore
      .collection(this.USER_COLLECTION_NAME)
      .doc(user.getId())
      .get();

    if (doc.exists) {
      return doc.data().currentSwipeMatchSession;
    } else {
      return null;
    }
  }

  static async updateCreatorCurrentSwipeMatchSession(firestore, user, id) {
    try {
      await firestore
        .collection(this.USER_COLLECTION_NAME)
        .doc(user.getId())
        .update({
          currentSwipeMatchSession: id,
        });
      return true;
    } catch (e) {
      return false;
    }
  }

  static async createSession(firestore, location) {
    const id = await this.generateGroupId();

    firestore.collection(this.SESSION_COLLECTION_NAME).doc(id).set({
      location,
      likes: {},
      sessionStarted: false,
      users: [],
    });

    return id;
  }

  static async retrieveSession(firestore, id) {
    const doc = await firestore
      .collection(this.SESSION_COLLECTION_NAME)
      .doc(id)
      .get();
    return doc.exists ? doc.data() : undefined;
  }

  static updateSession(firestore, id, opts) {
    firestore.collection(this.SESSION_COLLECTION_NAME).doc(id).update(opts);
  }

  static async deleteSession(firestore, user, id) {
    try {
      await Promise.all([
        firestore.collection(this.SESSION_COLLECTION_NAME).doc(id).delete(),
        this.updateCreatorCurrentSwipeMatchSession(firestore, user, null),
      ]);
      return true;
    } catch (e) {
      return false;
    }
  }

  static startSession(firestore, id) {
    this.updateSession(firestore, id, {
      sessionStarted: true,
    });
  }

  static addSessionListener(firestore, id, onUpdate, onError) {
    return firestore
      .collection(this.SESSION_COLLECTION_NAME)
      .doc(id)
      .onSnapshot(onUpdate, onError);
  }

  static addUser(firebase, firestore, id, username) {
    this.updateSession(firestore, id, {
      users: firebase.firestore.FieldValue.arrayUnion(username),
    });
  }

  static removeUser(firebase, firestore, id, username, fromWindow) {
    if (fromWindow) {
      const likes = {};
      if (window.swipeMatchSession) {
        for (const id of Object.keys(window.swipeMatchSession.likes)) {
          likes['likes.' + id] = firebase.firestore.FieldValue.arrayRemove(
            username
          );
        }
      }

      this.updateSession(firestore, id, {
        users: firebase.firestore.FieldValue.arrayRemove(username),
        ...likes,
      });
    } else {
      (async () => {
        const data = await this.retrieveSession(firestore, id);

        if (data) {
          const likes = {};
          for (const id of Object.keys(data.likes)) {
            likes['likes.' + id] = firebase.firestore.FieldValue.arrayRemove(
              username
            );
          }

          this.updateSession(firestore, id, {
            users: firebase.firestore.FieldValue.arrayRemove(username),
            ...likes,
          });
        }
      })();
    }
  }

  static swipeRestaurant(
    firebase,
    firestore,
    id,
    restaurantId,
    username,
    action
  ) {
    let value;
    if (action === 1 /* Action.INTERESTED */) {
      value = firebase.firestore.FieldValue.arrayUnion(username);
    } else {
      value = firebase.firestore.FieldValue.arrayRemove(username);
    }

    this.updateSession(firestore, id, {
      ['likes.' + restaurantId]: value,
    });
  }
}

export default SwipeMatchService;
