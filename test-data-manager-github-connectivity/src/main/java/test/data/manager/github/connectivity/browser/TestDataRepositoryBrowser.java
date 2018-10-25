package test.data.manager.github.connectivity.browser;

import java.io.DataOutputStream;
import java.net.HttpURLConnection;
import java.util.ArrayList;
import java.util.Arrays;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import org.codehaus.jackson.map.DeserializationConfig;
import org.codehaus.jackson.map.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import test.data.manager.github.connectivity.GitHubConnector;
import test.data.manager.github.connectivity.constants.GitRepositoryInfo;
import test.data.manager.github.connectivity.exception.ResourceNotFoundException;
import test.data.manager.github.connectivity.pojo.GitHubPathContentsResponse;
import test.data.manager.github.connectivity.pojo.RepositoryBrowserReleaseVersion;
import test.data.manager.github.connectivity.pojo.RepositoryBrowserTestDataInstance;
import test.data.manager.github.connectivity.pojo.RepositoryBrowserTestDataObject;
import test.data.manager.github.connectivity.pojo.RepositoryBrowserTestDataObjectAPI;

public class TestDataRepositoryBrowser {

	private static final Logger LOGGER = LoggerFactory.getLogger(TestDataRepositoryBrowser.class);

	public static void handleRequest(HttpServletRequest request, HttpServletResponse response) throws Exception {
		try {
			String requestUrl = request.getRequestURI();
			String[] requestUrlSplit = requestUrl.split("/");
			if (requestUrlSplit[1].equals("testdataobject") && requestUrlSplit[3].equals("details")
					&& requestUrlSplit.length == 4) {
				String testDataObject = requestUrlSplit[2];
				RepositoryBrowserTestDataObject testDataObjectDetails = TestDataRepositoryBrowser
						.getTestDataObjectDetails(testDataObject);
				DataOutputStream outputStream = new DataOutputStream(response.getOutputStream());
				ObjectMapper mapper = new ObjectMapper();
				mapper.writeValue(outputStream, testDataObjectDetails);
				outputStream.flush();
				outputStream.close();
			} else if (requestUrlSplit[1].equals("testdataobject") && requestUrlSplit[3].equals("testdataobjectapi")
					&& requestUrlSplit[5].equals("releaseversion") && requestUrlSplit[7].equals("testdatainstance")
					&& requestUrlSplit[9].equals("details") && requestUrlSplit.length == 10) {
				String testDataObject = requestUrlSplit[2];
				String testDataObjectAPI = requestUrlSplit[4];
				String releaseVersion = requestUrlSplit[6];
				String testDataInstanceFileName = requestUrlSplit[8];
				String sFilePath = "/S4HANA/" + testDataObject + "/" + testDataObjectAPI + "/" + releaseVersion + "/"
						+ testDataInstanceFileName;
				LOGGER.info("github download url : " + GitRepositoryInfo.gitHubContentDownloadUrlFromMaster(sFilePath));
				String testDataInstance = TestDataRepositoryBrowser
						.downloadFileContent(GitRepositoryInfo.gitHubContentDownloadUrlFromMaster(sFilePath));
				DataOutputStream outputStream = new DataOutputStream(response.getOutputStream());
				ObjectMapper mapper = new ObjectMapper();
				mapper.writeValue(outputStream, testDataInstance);
				outputStream.flush();
				outputStream.close();
			}
		} catch (Exception e) {
			response.getWriter().write(e.toString());
			response.setStatus(500);
		}
	}

	private static RepositoryBrowserTestDataObject getTestDataObjectDetails(String testDataObject) throws Exception {
		RepositoryBrowserTestDataObject testDataObjectDetails = new RepositoryBrowserTestDataObject();
		testDataObjectDetails.setTestDataObject(testDataObject);
		TestDataRepositoryBrowser.fetchDirectoriesFromGitHubForTestDataObject(testDataObjectDetails);
		return testDataObjectDetails;
	}

	private static void fetchDirectoriesFromGitHubForTestDataObject(
			RepositoryBrowserTestDataObject testDataObjectDetails) throws Exception {
		ArrayList<GitHubPathContentsResponse> testDataAPIs = TestDataRepositoryBrowser
				.fetchGitHubContents(testDataObjectDetails.getTestDataObject());
		for (int apicounter = 0; apicounter < testDataAPIs.size(); apicounter++) {
			if (!testDataAPIs.get(apicounter).getType().equals("dir"))
				continue;
			RepositoryBrowserTestDataObjectAPI apiDetail = new RepositoryBrowserTestDataObjectAPI();
			apiDetail.setTestDataObjectAPI(testDataAPIs.get(apicounter).getName());
			testDataObjectDetails.addApiDetail(apiDetail);
			ArrayList<GitHubPathContentsResponse> testDataAPIReleaseVersions = TestDataRepositoryBrowser
					.fetchGitHubContents(
							testDataObjectDetails.getTestDataObject() + "/" + apiDetail.getTestDataObjectAPI());
			for (int releasecounter = 0; releasecounter < testDataAPIReleaseVersions.size(); releasecounter++) {
				if (!testDataAPIReleaseVersions.get(releasecounter).getType().equals("dir"))
					continue;
				RepositoryBrowserReleaseVersion releaseVersion = new RepositoryBrowserReleaseVersion();
				releaseVersion.setReleaseVersion(testDataAPIReleaseVersions.get(releasecounter).getName());
				releaseVersion.setTestDataInstances(TestDataRepositoryBrowser.getTestDataObjectInstances(
						testDataObjectDetails.getTestDataObject(), testDataAPIs.get(apicounter).getName(),
						testDataAPIReleaseVersions.get(releasecounter).getName()));
				apiDetail.getReleaseVersions().add(releaseVersion);
			}
		}
	}

	private static ArrayList<RepositoryBrowserTestDataInstance> getTestDataObjectInstances(String testDataObject,
			String testDataObjectAPI, String releaseVersion) throws Exception {
		ArrayList<GitHubPathContentsResponse> testDataInstances = TestDataRepositoryBrowser
				.fetchGitHubContents(testDataObject + "/" + testDataObjectAPI + "/" + releaseVersion);
		ArrayList<RepositoryBrowserTestDataInstance> testDataInstancesObject = new ArrayList<RepositoryBrowserTestDataInstance>();
		for (int datainstancecounter = 0; datainstancecounter < testDataInstances.size(); datainstancecounter++) {
			if (!testDataInstances.get(datainstancecounter).getType().equals("file")
					|| testDataInstances.get(datainstancecounter).getName().equals("TestDataMeta.json"))
				continue;
			RepositoryBrowserTestDataInstance testDataInstance = new RepositoryBrowserTestDataInstance();
			testDataInstance.setTestDataFileName(testDataInstances.get(datainstancecounter).getName());
			testDataInstance.setTestData(TestDataRepositoryBrowser
					.downloadFileContent(testDataInstances.get(datainstancecounter).getDownload_url()));
			testDataInstancesObject.add(testDataInstance);
		}
		return testDataInstancesObject;
	}

	public static String downloadFileContent(String downloadUrl) throws Exception {
		downloadUrl = downloadUrl.replace("https://github.wdf.sap.corp", GitRepositoryInfo.getVirtualGitHubURI());
		HttpURLConnection urlConnection = GitHubConnector.getGitHubUrlConnection(downloadUrl);
		urlConnection.setRequestMethod("GET");
		if (urlConnection.getResponseCode() == 200) {
			return GitHubConnector.extractResponse(urlConnection);
		} else if (urlConnection.getResponseCode() == 404) {
			throw new ResourceNotFoundException();
		} else
			throw new Exception(GitHubConnector.extractResponse(urlConnection));
	}

	private static ArrayList<GitHubPathContentsResponse> fetchGitHubContents(String sDirectoryName) throws Exception {
		HttpURLConnection urlConnection = GitHubConnector
				.getGitHubUrlConnection(GitRepositoryInfo.getContentsAPIEndPoint("/" + sDirectoryName));
		urlConnection.setRequestMethod("GET");
		urlConnection.connect();
		if (urlConnection.getResponseCode() == 404)
			return new ArrayList<GitHubPathContentsResponse>();
		if (urlConnection.getResponseCode() != 200)
			throw new Exception(GitHubConnector.extractResponse(urlConnection));
		String gitHubPathContentResponse = GitHubConnector.extractResponse(urlConnection);
		ObjectMapper mapper = new ObjectMapper();
		mapper.configure(DeserializationConfig.Feature.FAIL_ON_UNKNOWN_PROPERTIES, false);
		ArrayList<GitHubPathContentsResponse> gitHubPathContentResponseObject = new ArrayList<GitHubPathContentsResponse>(
				Arrays.asList(mapper.readValue(gitHubPathContentResponse, GitHubPathContentsResponse[].class)));
		return gitHubPathContentResponseObject;
	}

}
