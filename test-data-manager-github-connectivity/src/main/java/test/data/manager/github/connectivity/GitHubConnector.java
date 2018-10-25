package test.data.manager.github.connectivity;

import java.io.BufferedInputStream;
import java.io.BufferedReader;
import java.io.DataOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.util.ArrayList;
import java.util.Arrays;

import org.codehaus.jackson.map.DeserializationConfig;
import org.codehaus.jackson.map.ObjectMapper;
import org.json.JSONException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import test.data.manager.github.connectivity.browser.TestDataRepositoryBrowser;
import test.data.manager.github.connectivity.constants.GitRepositoryInfo;
import test.data.manager.github.connectivity.constants.RequestType;
import test.data.manager.github.connectivity.exception.ResourceNotFoundException;
import test.data.manager.github.connectivity.pojo.CommitInfoResponse;
import test.data.manager.github.connectivity.pojo.FileBlobCommitToGitTreeFilePath;
import test.data.manager.github.connectivity.pojo.FileBlobCommitToGitTreeRequestBody;
import test.data.manager.github.connectivity.pojo.FileBlobCreationRequestBody;
import test.data.manager.github.connectivity.pojo.FileBlobGitCommitRequestBody;
import test.data.manager.github.connectivity.pojo.HeadReferenceResponse;
import test.data.manager.github.connectivity.pojo.NewGitHubBranchRequestBody;
import test.data.manager.github.connectivity.pojo.NewPullRequestBody;
import test.data.manager.github.connectivity.pojo.NewPullRequestResponse;
import test.data.manager.github.connectivity.pojo.RequestDetail;
import test.data.manager.github.connectivity.pojo.SHAResponse;
import test.data.manager.github.connectivity.pojo.TestDataMeta;
import test.data.manager.github.connectivity.pojo.UpdateHeadReferenceRequestBody;

public class GitHubConnector {

	private static final Logger LOGGER = LoggerFactory.getLogger(GitHubConnector.class);

	public static String fetchLastCommit() throws Exception {
		HttpURLConnection urlConnection = GitHubConnector
				.getGitHubUrlConnection(GitRepositoryInfo.getMasterHeadReferenceAPIEndPoint());
		urlConnection.setRequestMethod("GET");
		urlConnection.connect();
		if (urlConnection.getResponseCode() == 200) {
			String headReferenceResponse = GitHubConnector.extractResponse(urlConnection);
			ObjectMapper mapper = new ObjectMapper();
			mapper.configure(DeserializationConfig.Feature.FAIL_ON_UNKNOWN_PROPERTIES, false);
			HeadReferenceResponse headReferenceResponseObject = mapper.readValue(headReferenceResponse,
					HeadReferenceResponse.class);
			return headReferenceResponseObject.getObject().getSha();
		} else
			throw new Exception(GitHubConnector.extractResponse(urlConnection));
	}

	public static String createNewFeatureBranchForTheCommit(String gitRepoLastCommitSHA) throws Exception {
		HttpURLConnection urlConnection = GitHubConnector
				.getGitHubUrlConnection(GitRepositoryInfo.getReferenceAPIEndPoint());
		urlConnection.setRequestMethod("POST");
		urlConnection.setRequestProperty("Content-Type", "application/json");
		urlConnection.setDoOutput(true);
		urlConnection.setDoInput(true);
		String newBranch = GitHubConnector.addNewFeatureBranchRequestBody(urlConnection, gitRepoLastCommitSHA);
		if (urlConnection.getResponseCode() == 201) {
			return newBranch;
		} else
			throw new Exception(GitHubConnector.extractResponse(urlConnection));
	}

	private static String addNewFeatureBranchRequestBody(HttpURLConnection urlConnection, String gitRepoLastCommitSHA)
			throws Exception {
		DataOutputStream outputStream = new DataOutputStream(urlConnection.getOutputStream());
		ObjectMapper mapper = new ObjectMapper();
		NewGitHubBranchRequestBody requestBody = new NewGitHubBranchRequestBody();
		requestBody.setSha(gitRepoLastCommitSHA);
		String newBranch = "feature_" + java.util.UUID.randomUUID();
		requestBody.setRef("refs/heads/" + newBranch);
		mapper.writeValue(outputStream, requestBody);
		outputStream.flush();
		outputStream.close();
		return newBranch;
	}

	public static String fetchSHAofGitTreeFromLastCommitUrl(String gitRepoLastCommitSHA) throws Exception {
		HttpURLConnection urlConnection = GitHubConnector
				.getGitHubUrlConnection(GitRepositoryInfo.getCommitAPIEndPoint(gitRepoLastCommitSHA));
		urlConnection.setRequestMethod("GET");
		urlConnection.connect();
		if (urlConnection.getResponseCode() == 200) {
			String commitInfoResponse = GitHubConnector.extractResponse(urlConnection);
			ObjectMapper mapper = new ObjectMapper();
			mapper.configure(DeserializationConfig.Feature.FAIL_ON_UNKNOWN_PROPERTIES, false);
			CommitInfoResponse commitInfoResponseObject = mapper.readValue(commitInfoResponse,
					CommitInfoResponse.class);
			return commitInfoResponseObject.getTree().getSha();
		} else
			throw new Exception(GitHubConnector.extractResponse(urlConnection));
	}

	public static String createFileAsBlob(RequestDetail requestDetail, RequestType requestType) throws Exception {
		HttpURLConnection urlConnection = GitHubConnector
				.getGitHubUrlConnection(GitRepositoryInfo.getBlobAPIEndPoint());
		urlConnection.setRequestMethod("POST");
		urlConnection.setRequestProperty("Content-Type", "application/json");
		urlConnection.setDoOutput(true);
		urlConnection.setDoInput(true);
		String fileContent = "";
		if (requestType.equals(RequestType.TestDataMeta)) {
			ObjectMapper mapper = new ObjectMapper();
			fileContent = mapper.writeValueAsString(requestDetail.getTestDataRepository().getTestDataMeta());
		} else if (requestType.equals(RequestType.TestData))
			fileContent = requestDetail.getTestDataRepository().getTestData();
		else
			throw new Exception("Github communication failed: request type not known");
		GitHubConnector.addFileAsBlobRequestBody(urlConnection, fileContent);
		if (urlConnection.getResponseCode() == 201) {
			String fileCreationResponse = GitHubConnector.extractResponse(urlConnection);
			ObjectMapper mapper = new ObjectMapper();
			mapper.configure(DeserializationConfig.Feature.FAIL_ON_UNKNOWN_PROPERTIES, false);
			SHAResponse fileCreationResponseObject = mapper.readValue(fileCreationResponse, SHAResponse.class);
			return fileCreationResponseObject.getSha();
		} else
			throw new Exception(GitHubConnector.extractResponse(urlConnection));
	}

	private static void addFileAsBlobRequestBody(HttpURLConnection urlConnection, String fileContent) throws Exception {
		DataOutputStream outputStream = new DataOutputStream(urlConnection.getOutputStream());
		ObjectMapper mapper = new ObjectMapper();
		FileBlobCreationRequestBody requestBody = new FileBlobCreationRequestBody();
		requestBody.setEncoding("utf-8");
		requestBody.setContent(fileContent);
		mapper.writeValue(outputStream, requestBody);
		outputStream.flush();
		outputStream.close();
	}

	public static void appendTestDataMetaWithPreviousMetaInRepository(RequestDetail requestDetail) throws Exception {
		String sFilePath = "/S4HANA/" + requestDetail.getTestDataRepository().getTestDataObject() + "/"
				+ requestDetail.getTestDataRepository().getTestDataObjectAPI() + "/"
				+ requestDetail.getTestDataRepository().getReleaseVersion() + "/TestDataMeta.json";
		try {
			String sTestDataInstancesMeta = TestDataRepositoryBrowser
					.downloadFileContent(GitRepositoryInfo.gitHubContentDownloadUrlFromMaster(sFilePath));
			ObjectMapper mapper = new ObjectMapper();
			ArrayList<TestDataMeta> previousTestDataMetaInstances = new ArrayList<TestDataMeta>(
					Arrays.asList(mapper.readValue(sTestDataInstancesMeta, TestDataMeta[].class)));
			requestDetail.getTestDataRepository().getTestDataMeta().addAll(previousTestDataMetaInstances);
		} catch (ResourceNotFoundException e) {

		}
	}

	public static String addCreatedFileBlobToGitTree(String oldTreeSHA, String createdTestDataBlobSHA,
			String createdTestDataMetaBlobSHA, RequestDetail requestDetail) throws Exception {
		HttpURLConnection urlConnection = GitHubConnector
				.getGitHubUrlConnection(GitRepositoryInfo.getTreeAPIEndPoint());
		urlConnection.setRequestMethod("POST");
		urlConnection.setRequestProperty("Content-Type", "application/json");
		urlConnection.setDoOutput(true);
		urlConnection.setDoInput(true);
		GitHubConnector.addFileBlobToGitTreeRequestBody(urlConnection, oldTreeSHA, createdTestDataBlobSHA,
				createdTestDataMetaBlobSHA, requestDetail);
		if (urlConnection.getResponseCode() == 201) {
			String fileAdditionToGitTreeResponse = GitHubConnector.extractResponse(urlConnection);
			ObjectMapper mapper = new ObjectMapper();
			mapper.configure(DeserializationConfig.Feature.FAIL_ON_UNKNOWN_PROPERTIES, false);
			SHAResponse fileAdditionToGitTreeResponseObject = mapper.readValue(fileAdditionToGitTreeResponse,
					SHAResponse.class);
			return fileAdditionToGitTreeResponseObject.getSha();
		} else
			throw new Exception(GitHubConnector.extractResponse(urlConnection));
	}

	public static void addFileBlobToGitTreeRequestBody(HttpURLConnection urlConnection, String oldTreeSHA,
			String createdTestDataBlobSHA, String createdTestDataMetaBlobSHA, RequestDetail requestDetail)
			throws Exception {
		DataOutputStream outputStream = new DataOutputStream(urlConnection.getOutputStream());
		ObjectMapper mapper = new ObjectMapper();
		FileBlobCommitToGitTreeRequestBody requestBody = new FileBlobCommitToGitTreeRequestBody();
		requestBody.setBase_tree(oldTreeSHA);
		requestBody.addTreeEndtry(new FileBlobCommitToGitTreeFilePath());
		requestBody.getTree().get(0).setSha(createdTestDataBlobSHA);
		String sFilePath = "S4HANA/" + requestDetail.getTestDataRepository().getTestDataObject() + "/"
				+ requestDetail.getTestDataRepository().getTestDataObjectAPI() + "/"
				+ requestDetail.getTestDataRepository().getReleaseVersion() + "/"
				+ requestDetail.getTestDataRepository().getTestDataMeta().get(0).getFileName();
		requestBody.getTree().get(0).setPath(sFilePath);
		// add test data meta
		requestBody.addTreeEndtry(new FileBlobCommitToGitTreeFilePath());
		requestBody.getTree().get(1).setSha(createdTestDataMetaBlobSHA);
		sFilePath = "S4HANA/" + requestDetail.getTestDataRepository().getTestDataObject() + "/"
				+ requestDetail.getTestDataRepository().getTestDataObjectAPI() + "/"
				+ requestDetail.getTestDataRepository().getReleaseVersion() + "/TestDataMeta.json";
		requestBody.getTree().get(1).setPath(sFilePath);
		mapper.writeValue(outputStream, requestBody);
		outputStream.flush();
		outputStream.close();
	}

	public static String submitChangeToGitTreeAsNewCommit(String createdFileBlobGitTreeSHA, String gitRepoLastCommitSHA,
			RequestDetail requestDetail) throws Exception {
		HttpURLConnection urlConnection = GitHubConnector
				.getGitHubUrlConnection(GitRepositoryInfo.getCommitAPIEndPoint());
		urlConnection.setRequestMethod("POST");
		urlConnection.setRequestProperty("Content-Type", "application/json");
		urlConnection.setDoOutput(true);
		urlConnection.setDoInput(true);
		GitHubConnector.addChangeToGitTreeAsNewCommitRequestBody(urlConnection, createdFileBlobGitTreeSHA,
				gitRepoLastCommitSHA, requestDetail);
		if (urlConnection.getResponseCode() == 201) {
			String newCommitResponse = GitHubConnector.extractResponse(urlConnection);
			ObjectMapper mapper = new ObjectMapper();
			mapper.configure(DeserializationConfig.Feature.FAIL_ON_UNKNOWN_PROPERTIES, false);
			SHAResponse newCommitResponseObject = mapper.readValue(newCommitResponse, SHAResponse.class);
			return newCommitResponseObject.getSha();
		} else
			throw new Exception(GitHubConnector.extractResponse(urlConnection));
	}

	public static void addChangeToGitTreeAsNewCommitRequestBody(HttpURLConnection urlConnection,
			String createdFileBlobGitTreeSHA, String gitRepoLastCommitSHA, RequestDetail requestDetail)
			throws Exception {
		DataOutputStream outputStream = new DataOutputStream(urlConnection.getOutputStream());
		ObjectMapper mapper = new ObjectMapper();
		FileBlobGitCommitRequestBody requestBody = new FileBlobGitCommitRequestBody();
		String sCommitMessage = requestDetail.getTestDataRepository().getComments();
		requestBody.setMessage(sCommitMessage);
		requestBody.getParents()[0] = gitRepoLastCommitSHA;
		requestBody.setTree(createdFileBlobGitTreeSHA);
		mapper.writeValue(outputStream, requestBody);
		outputStream.flush();
		outputStream.close();
	}

	public static void moveHEADReferenceToNewCommit(String newCommitSHA, String newBranchName) throws Exception {
		HttpURLConnection urlConnection = GitHubConnector
				.getGitHubUrlConnection(GitRepositoryInfo.getHeadReferenceForBranchAPIEndPoint(newBranchName));
		urlConnection.setRequestProperty("X-HTTP-Method-Override", "PATCH");
		urlConnection.setRequestMethod("POST");
		urlConnection.setRequestProperty("Content-Type", "application/json");
		urlConnection.setDoOutput(true);
		urlConnection.setDoInput(true);
		GitHubConnector.addHeadReferenceToNewCommitRequestBody(urlConnection, newCommitSHA);
		if (urlConnection.getResponseCode() != 200)
			throw new Exception(GitHubConnector.extractResponse(urlConnection));
	}

	public static void addHeadReferenceToNewCommitRequestBody(HttpURLConnection urlConnection, String newCommitSHA)
			throws Exception {
		DataOutputStream outputStream = new DataOutputStream(urlConnection.getOutputStream());
		ObjectMapper mapper = new ObjectMapper();
		UpdateHeadReferenceRequestBody requestBody = new UpdateHeadReferenceRequestBody();
		requestBody.setSha(newCommitSHA);
		mapper.writeValue(outputStream, requestBody);
		outputStream.flush();
		outputStream.close();
	}

	public static String createPullRequestFromNewBranchToMaster(String newBranchName, String comments)
			throws Exception {
		HttpURLConnection urlConnection = GitHubConnector
				.getGitHubUrlConnection(GitRepositoryInfo.getPullRequestAPIEndPoint());
		urlConnection.setRequestMethod("POST");
		urlConnection.setRequestProperty("Content-Type", "application/json");
		urlConnection.setDoOutput(true);
		urlConnection.setDoInput(true);
		GitHubConnector.addNewPullRequestBody(urlConnection, newBranchName, comments);
		if (urlConnection.getResponseCode() == 201) {
			String newPullRequestResponse = GitHubConnector.extractResponse(urlConnection);
			ObjectMapper mapper = new ObjectMapper();
			mapper.configure(DeserializationConfig.Feature.FAIL_ON_UNKNOWN_PROPERTIES, false);
			NewPullRequestResponse newPullRequestResponseObject = mapper.readValue(newPullRequestResponse,
					NewPullRequestResponse.class);
			return newPullRequestResponseObject.getHtml_url();
		} else
			throw new Exception(GitHubConnector.extractResponse(urlConnection));
	}

	private static void addNewPullRequestBody(HttpURLConnection urlConnection, String newBranchName, String comments)
			throws Exception {
		DataOutputStream outputStream = new DataOutputStream(urlConnection.getOutputStream());
		ObjectMapper mapper = new ObjectMapper();
		NewPullRequestBody requestBody = new NewPullRequestBody();
		requestBody.setBase("master");
		requestBody.setHead(newBranchName);
		requestBody.setTitle("Merge Feature - " + comments);
		mapper.writeValue(outputStream, requestBody);
		outputStream.flush();
		outputStream.close();
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

	public static HttpURLConnection getGitHubUrlConnection(String gitHubRequestEndpoint)
			throws JSONException, IOException {
		return OnPremConnectivity.createRequestUsingConnectivityService(gitHubRequestEndpoint, "username",
				"password");
	}

}
