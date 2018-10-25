package test.data.manager.github.connectivity;

import java.io.IOException;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import test.data.manager.github.connectivity.browser.TestDataRepositoryBrowser;
import test.data.manager.github.connectivity.pojo.RequestDetail;

@WebServlet("/*")
public class GitHubRequestHandler extends HttpServlet {

	private static final long serialVersionUID = 1L;
	private static final Logger LOGGER = LoggerFactory.getLogger(GitHubRequestHandler.class);

	protected void service(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {
		try {
			if (request.getMethod().equals("POST")) {
				RequestDetail requestDetail = RequestDetailsExtractor.extractAndFetchRequestDetails(request);
				FileHandler.commitFile(requestDetail, response);
				response.setStatus(201);
			} else if (request.getMethod().equals("GET")) {
				String requestUrl = request.getRequestURI();
				if (requestUrl.split("/")[1].equals("testdataobject"))
					TestDataRepositoryBrowser.handleRequest(request, response);
				else if (requestUrl.split("/")[1].equals("jwt"))
					this.outputJWTToken(request, response);
				else
					throw new Exception("request not allowed");
			} else {
				throw new Exception("request method not allowed");
			}
		} catch (Exception e) {
			LOGGER.error("Exception happened:", e.toString());
			response.getWriter().write(e.toString());
			response.setStatus(500);
		}
	}

	private void outputJWTToken(HttpServletRequest request, HttpServletResponse response) throws Exception {
		response.getWriter().write(request.getHeader("Authorization"));
	}
}
