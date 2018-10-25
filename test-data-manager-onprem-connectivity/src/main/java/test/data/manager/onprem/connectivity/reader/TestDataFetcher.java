package test.data.manager.onprem.connectivity.reader;

import java.net.HttpURLConnection;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import org.apache.commons.io.IOUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import test.data.manager.onprem.connectivity.OnPremRequestUtils;

public class TestDataFetcher {

	private static final Logger LOGGER = LoggerFactory.getLogger(TestDataFetcher.class);

	public static void handleRequest(HttpServletRequest request, HttpServletResponse response) throws Exception {
		final String virtualUrl = OnPremRequestUtils.fetchVirtualUrl(request);
		final HttpURLConnection urlConnection = OnPremRequestUtils.fetchUrlConnection(virtualUrl);
		OnPremRequestUtils.addWhitelistedHeaders(request, urlConnection);
		OnPremRequestUtils.addAuthorization(urlConnection, request.getRequestURI().split("/")[1]);
		LOGGER.info("sending request to backend began");
		urlConnection.setRequestMethod(request.getMethod());
		if (request.getMethod().equals("POST")) {
			urlConnection.setDoOutput(true);
			IOUtils.copy(request.getInputStream(), urlConnection.getOutputStream());
		} else
			urlConnection.connect();
		urlConnection.getHeaderFields().entrySet().forEach(e -> {
			e.getValue().forEach(v -> {
				response.addHeader(e.getKey(), v);
			});
		});
		response.setStatus(urlConnection.getResponseCode());
		IOUtils.copy(urlConnection.getInputStream(), response.getOutputStream());
		LOGGER.info("sending request to backend done. response received");
	}

}
