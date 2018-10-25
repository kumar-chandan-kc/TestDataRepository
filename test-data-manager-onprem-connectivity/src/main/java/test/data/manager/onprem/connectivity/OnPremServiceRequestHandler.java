package test.data.manager.onprem.connectivity;

import java.io.IOException;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import test.data.manager.onprem.connectivity.deployer.TestDataDeployer;
import test.data.manager.onprem.connectivity.reader.TestDataFetcher;

@WebServlet("/*")
public class OnPremServiceRequestHandler extends HttpServlet {

	private static final long serialVersionUID = 1L;
	private static final Logger LOGGER = LoggerFactory.getLogger(OnPremServiceRequestHandler.class);

	protected void service(HttpServletRequest request, HttpServletResponse response)
			throws ServletException, IOException {
		try {
			if (request.getMethod().equals("POST") && request.getRequestURI().split("/")[1].equals("deployer")) {
				TestDataDeployer.handleRequest(request, response);
			} else {
				TestDataFetcher.handleRequest(request, response);
			}
		} catch (Exception e) {
			LOGGER.error("checkpoint failure:", e.toString());
			response.setStatus(500);
			response.getWriter().write(e.toString());
		}
	}
}
