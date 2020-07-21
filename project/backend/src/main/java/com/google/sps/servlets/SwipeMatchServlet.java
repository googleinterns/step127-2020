package com.google.sps.servlets;

import java.io.IOException;
import java.io.PrintWriter;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.BlockingQueue;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.CopyOnWriteArrayList;
import java.util.concurrent.LinkedBlockingQueue;
import javax.servlet.AsyncContext;
import javax.servlet.AsyncEvent;
import javax.servlet.AsyncListener;
import javax.servlet.ServletConfig;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

@WebServlet("/api/swipematch")
public class SwipeMatchServlet extends HttpServlet {
  private boolean running;

  private Map<String, AsyncContext> asyncContexts = new ConcurrentHashMap<>();

  private BlockingQueue<String> queue = new LinkedBlockingQueue<>();

  private List<String> store = new CopyOnWriteArrayList<>();

  private Thread notifier = new Thread(() -> {
    while (running) {
      try {
        String user = queue.take();

        store.add(user);

        for (AsyncContext asyncContext : asyncContexts.values()) {
          try {
            sendUser(asyncContext.getResponse().getWriter(), user);
          } catch (Exception e) {
            asyncContexts.values().remove(asyncContext);
          }
        }
      } catch (InterruptedException e) {
        // idk yet
      }
    }
  });

  @Override
  public void destroy() {
    running = false;
    asyncContexts.clear();
    queue.clear();
    store.clear();
  }

  @Override
  public void init(ServletConfig config) throws ServletException {
    super.init(config);

    running = true;
    notifier.start();
  }

  @Override
  public void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException {
    if (request.getHeader("Accept").equals("text/event-stream")) {
      String username = request.getParameter("username");
      queue.put(username);

      response.setContentType("text/event-stream");
      response.setHeader("Cache-Control", "no-cache");
      response.setHeader("Connection", "keep-alive");
      response.setCharacterEncoding("UTF-8");

      for (String user : store) {
        sendUser(response.getWriter(), user);
      }

      final String id = UUID.randomUUID().toString();
      final AsyncContext asyncContext = request.startAsync();
      asyncContext.addListener(new AsyncListener() {
        @Override
        public void onComplete(AsyncEvent event) throws IOException {
          asyncContexts.remove(id);
        }

        @Override
        public void onError(AsyncEvent event) throws IOException {
          asyncContexts.remove(id);
        }

        @Override
        public void onStartAsync(AsyncEvent event) throws IOException {
          // idk yet
        }

        @Override
        public void onTimeout(AsyncEvent event) throws IOException {
          asyncContexts.remove(id);
        }
      });

      asyncContexts.put(id, asyncContext);
    }
  }

  private void sendUser(PrintWriter writer, String user) {
    writer.print("event: userconnect");
    writer.println("data: " + user);
    writer.println();
    writer.flush();
  }
}
