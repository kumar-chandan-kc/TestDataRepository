package test.data.manager.github.connectivity.constants;

public class GitRepositoryInfo {

	private final static String orgName = "CLDFNDTDM";

	private final static String repoName = "test-data";

	private final static String virtualGitHubURI = "http://github.wdf.sap.corp:443";

	private final static String gitHubRestAPIPath = "/api/v3";

	private final static String referenceMasterHeadPath = "/refs/heads/master";

	private final static String refPath = "/refs";

	private final static String commitsPath = "/commits";

	private final static String blobPath = "/blobs";

	private final static String treePath = "/trees";

	private final static String pullRequestPath = "/pulls";

	private final static String contentsPath = "/contents";

	public static String getOrgName() {
		return orgName;
	}

	public static String getRepoName() {
		return repoName;
	}

	public static String getVirtualGitHubURI() {
		return virtualGitHubURI;
	}

	public static String getGitHubRestAPIPath() {
		return gitHubRestAPIPath;
	}

	public static String getReferenceMasterHead() {
		return referenceMasterHeadPath;
	}

	public static String getRefpath() {
		return refPath;
	}

	public static String getCommitsPath() {
		return commitsPath;
	}

	public static String getBlobpath() {
		return blobPath;
	}

	public static String getTreepath() {
		return treePath;
	}

	public static String getPullrequestpath() {
		return pullRequestPath;
	}

	public static String getContentsPath() {
		return contentsPath;
	}

	public static String getTestDataRepositoryPath() {
		return "/repos/" + GitRepositoryInfo.getOrgName() + "/" + GitRepositoryInfo.getRepoName();
	}

	public static String getMasterHeadReferenceAPIEndPoint() {
		return GitRepositoryInfo.getVirtualGitHubURI() + GitRepositoryInfo.getGitHubRestAPIPath()
				+ GitRepositoryInfo.getTestDataRepositoryPath() + "/git" + GitRepositoryInfo.getReferenceMasterHead();
	}

	public static String getReferenceAPIEndPoint() {
		return GitRepositoryInfo.getVirtualGitHubURI() + GitRepositoryInfo.getGitHubRestAPIPath()
				+ GitRepositoryInfo.getTestDataRepositoryPath() + "/git" + GitRepositoryInfo.getRefpath();
	}

	public static String getHeadReferenceForBranchAPIEndPoint(String branchName) {
		return GitRepositoryInfo.getVirtualGitHubURI() + GitRepositoryInfo.getGitHubRestAPIPath()
				+ GitRepositoryInfo.getTestDataRepositoryPath() + "/git" + GitRepositoryInfo.getRefpath() + "/heads/"
				+ branchName;
	}

	public static String getCommitAPIEndPoint(String commitSHA) {
		return GitRepositoryInfo.getVirtualGitHubURI() + GitRepositoryInfo.getGitHubRestAPIPath()
				+ GitRepositoryInfo.getTestDataRepositoryPath() + "/git" + GitRepositoryInfo.getCommitsPath() + "/"
				+ commitSHA;
	}

	public static String getBlobAPIEndPoint() {
		return GitRepositoryInfo.getVirtualGitHubURI() + GitRepositoryInfo.getGitHubRestAPIPath()
				+ GitRepositoryInfo.getTestDataRepositoryPath() + "/git" + GitRepositoryInfo.getBlobpath();
	}

	public static String getTreeAPIEndPoint() {
		return GitRepositoryInfo.getVirtualGitHubURI() + GitRepositoryInfo.getGitHubRestAPIPath()
				+ GitRepositoryInfo.getTestDataRepositoryPath() + "/git" + GitRepositoryInfo.getTreepath();
	}

	public static String getCommitAPIEndPoint() {
		return GitRepositoryInfo.getVirtualGitHubURI() + GitRepositoryInfo.getGitHubRestAPIPath()
				+ GitRepositoryInfo.getTestDataRepositoryPath() + "/git" + GitRepositoryInfo.getCommitsPath();
	}

	public static String getPullRequestAPIEndPoint() {
		return GitRepositoryInfo.getVirtualGitHubURI() + GitRepositoryInfo.getGitHubRestAPIPath()
				+ GitRepositoryInfo.getTestDataRepositoryPath() + GitRepositoryInfo.getPullrequestpath();
	}

	public static String getContentsAPIEndPoint(String sContentPath) {
		return GitRepositoryInfo.getVirtualGitHubURI() + GitRepositoryInfo.getGitHubRestAPIPath()
				+ GitRepositoryInfo.getTestDataRepositoryPath() + GitRepositoryInfo.getContentsPath() + "/S4HANA"
				+ sContentPath;
	}

	public static String gitHubContentDownloadUrlFromMaster(String sFilePath) {
		return GitRepositoryInfo.getVirtualGitHubURI() + "/raw/" + GitRepositoryInfo.getOrgName() + "/"
				+ GitRepositoryInfo.getRepoName() + "/master" + sFilePath;
	}

}
