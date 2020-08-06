package com.google.sps.servlets;

import com.google.auth.oauth2.GoogleCredentials;
import com.google.cloud.firestore.Firestore;
import com.google.cloud.firestore.FirestoreOptions;
import java.io.IOException;
import java.util.Optional;
import java.util.concurrent.ExecutionException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

@WebServlet("/api/swipe-match/generate-group-id")
public class GenerateSwipeMatchGroupIdServlet extends HttpServlet {
  private static final String PROJECT_ID = "mak-step-2020";
  private static final String ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  private static final String NUMBERS = "0123456789";
  private static final int GROUP_ID_LENGTH = 8;
  private static final String COLLECTION_NAME = "swipe-match-sessions";
  private static final int RETRY_LIMIT = 10;

  private Optional<FirestoreOptions> firestoreOptions;
  private Optional<Firestore> db;

  private class RetryLimitExceededException extends Exception {
    public RetryLimitExceededException(String message) {
      super(message);
    }
  }

  @Override
  public void init() {
    try {
      firestoreOptions = Optional.of(FirestoreOptions.getDefaultInstance()
                                         .toBuilder()
                                         .setProjectId(PROJECT_ID)
                                         .setCredentials(GoogleCredentials.getApplicationDefault())
                                         .build());

      db = Optional.of(firestoreOptions.getService());
    } catch (IOException e) {
      firestoreOptions = Optional.empty();
      db = Optional.empty();
    }
  }

  @Override
  public void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException {
    if (db.isPresent()) {
      try {
        String groupId = generateGroupId(0);
        // TODO: replace ABCD1234 with groupId
        response.getWriter().println("{\"groupId\": \"ABCD1234\"}");
      } catch (RetryLimitExceededException e) {
        response.sendError(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
      }
    } else {
      response.sendError(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
    }
  }

  private String generateGroupId(int count) throws RetryLimitExceededException {
    if (count == RETRY_LIMIT) {
      throw new RetryLimitExceededException("Group ID generation retry limit exceeded.");
    }

    String groupId = "";
    for (int i = 0; i < GROUP_ID_LENGTH / 2; i++) {
      groupId = ALPHABET.charAt((int) Math.floor(Math.random() * ALPHABET.length())) + groupId;
      groupId += NUMBERS.charAt((int) Math.floor(Math.random() * NUMBERS.length()));
    }

    if (isGroupIdUnique(groupId)) {
      return groupId;
    } else {
      return generateGroupId(count + 1);
    }
  }

  private boolean isGroupIdUnique(String groupId) {
    try {
      return !db.get().collection(COLLECTION_NAME).document(groupId).get().get().exists();
    } catch (InterruptedException | ExecutionException e) {
      return false;
    }
  }
}
