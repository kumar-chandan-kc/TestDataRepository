package test.data.manager.onprem.connectivity.deployer;

import java.io.BufferedInputStream;
import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.OutputStreamWriter;
import java.net.HttpURLConnection;
import java.net.URL;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.io.IOUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.fasterxml.jackson.core.JsonFactory;
import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

import test.data.manager.onprem.connectivity.OnPremRequestUtils;
import test.data.manager.onprem.connectivity.OnPremSystems;
import test.data.manager.onprem.connectivity.pojo.TestDataDeployerRequestBody;

public class TestDataDeployer {

	private static final Logger LOGGER = LoggerFactory.getLogger(TestDataDeployer.class);

	public static void handleRequest(HttpServletRequest request, HttpServletResponse response) throws Exception {
		ObjectMapper mapper = new ObjectMapper();
		mapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
		TestDataDeployerRequestBody testDataDeploymentDetails = mapper
				.readValue(IOUtils.toString(request.getInputStream()), TestDataDeployerRequestBody.class);
		HttpURLConnection gitHubUrlConnection = TestDataDeployer.fetchTestDataFromGitHub(testDataDeploymentDetails,
				request);
		TestDataDeployer.deployTestDataToOnPremSystem(testDataDeploymentDetails, gitHubUrlConnection);
	}

	private static HttpURLConnection fetchTestDataFromGitHub(TestDataDeployerRequestBody testDataDeploymentDetails,
			HttpServletRequest request) throws Exception {
		String githubEndPoint = System.getenv("github_endpoint");
		githubEndPoint = githubEndPoint + "/testdataobject/" + testDataDeploymentDetails.getTestDataObject()
				+ "/testdataobjectapi/" + testDataDeploymentDetails.getTestDataObjectAPI() + "/releaseversion/"
				+ testDataDeploymentDetails.getReleaseVersion() + "/testdatainstance/"
				+ testDataDeploymentDetails.getTestDataObjectFileName() + "/details";
		final URL url = new URL(githubEndPoint);
		HttpURLConnection urlConnection = (HttpURLConnection) url.openConnection();
		urlConnection.setRequestProperty("Authorization", request.getHeader("Authorization"));
		urlConnection.connect();
		if (urlConnection.getResponseCode() == 200) {
			return urlConnection;
		} else
			throw new Exception(TestDataDeployer.extractResponse(urlConnection));
	}

	private static void deployTestDataToOnPremSystem(TestDataDeployerRequestBody testDataDeploymentDetails,
			HttpURLConnection gitHubUrlConnection) throws Exception {
		final String onPremSystemVirtualHost = OnPremSystems.systemsMap
				.get(testDataDeploymentDetails.getSystemToDeploy());
		if (onPremSystemVirtualHost == null)
			throw new Exception("OnPrem system not known");
		JsonNode testDataParsed = TestDataDeployer.cleanTestData(TestDataDeployer.extractResponse(gitHubUrlConnection));
		final String virtualUrl = "http://" + onPremSystemVirtualHost + "/sap/opu/odata/sap/"
				+ testDataDeploymentDetails.getTestDataObjectAPI();
		final String clientParam = "sap-client=" + testDataDeploymentDetails.getSystemClientToDeploy();
		final String entitySet = "A_Product";
		final HttpURLConnection urlConnection = OnPremRequestUtils
				.fetchUrlConnection(virtualUrl + "/" + entitySet + "?" + clientParam);
		OnPremRequestUtils.addAuthorization(urlConnection, testDataDeploymentDetails.getSystemToDeploy());
		TestDataDeployer.addCSRFToken(virtualUrl, testDataDeploymentDetails.getSystemToDeploy(), clientParam,
				urlConnection);
		urlConnection.setRequestProperty("content-type", "application/json");
		urlConnection.setRequestMethod("POST");
		urlConnection.setDoOutput(true);
		OutputStreamWriter outputStream = new OutputStreamWriter(urlConnection.getOutputStream());
		outputStream.write(testDataParsed.asText());
		outputStream.flush();
		outputStream.close();
		if (urlConnection.getResponseCode() != 201)
			throw new Exception(TestDataDeployer.extractResponse(urlConnection));
	}

	private static JsonNode cleanTestData(String json) throws Exception {
		ObjectMapper mapper = new ObjectMapper();
		JsonFactory factory = mapper.getFactory();
		JsonParser parser = factory.createParser(json);
		JsonNode testDataParsed = mapper.readTree(parser);
		return testDataParsed;
	}

	private static void addCSRFToken(String virtualUrl, String systemToDeploy, String clientParam,
			HttpURLConnection postRequestUrlConnection) throws Exception {
		final HttpURLConnection urlConnection = OnPremRequestUtils
				.fetchUrlConnection(virtualUrl + "/$metadata?" + clientParam);
		OnPremRequestUtils.addAuthorization(urlConnection, systemToDeploy);
		urlConnection.setRequestMethod("GET");
		urlConnection.setRequestProperty("x-csrf-token", "Fetch");
		urlConnection.connect();
		if (urlConnection.getResponseCode() == 200) {
			postRequestUrlConnection.setRequestProperty("x-csrf-token", urlConnection.getHeaderField("x-csrf-token"));
			postRequestUrlConnection.setRequestProperty("cookie",
					urlConnection.getHeaderField("set-cookie").split(";")[0]);
		} else
			throw new Exception(TestDataDeployer.extractResponse(urlConnection));
	}

	public static String extractResponse(HttpURLConnection urlConnection) throws IOException {
		InputStream is = new BufferedInputStream(urlConnection.getInputStream());
		BufferedReader br = new BufferedReader(new InputStreamReader(is));
		String inputLine = "";
		StringBuffer sb = new StringBuffer();
		while ((inputLine = br.readLine()) != null) {
			sb.append(inputLine);
		}
		return sb.toString();
	}

}
