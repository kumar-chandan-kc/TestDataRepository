package test.data.manager.github.connectivity.pojo;

public class NewGitCommitDetail {

	private String newBranchName;

	private String gitRepoLastCommitSHA;

	private String oldTreeSHA;

	private String testDataBlobSHA;

	private String testDataMetaBlobSHA;

	private String createdFilesGitTreeSHA;

	private String newCommitSHA;

	private String pullRequestUrl;

	public String getNewBranchName() {
		return newBranchName;
	}

	public void setNewBranchName(String newBranchName) {
		this.newBranchName = newBranchName;
	}

	public String getGitRepoLastCommitSHA() {
		return gitRepoLastCommitSHA;
	}

	public void setGitRepoLastCommitSHA(String gitRepoLastCommitSHA) {
		this.gitRepoLastCommitSHA = gitRepoLastCommitSHA;
	}

	public String getOldTreeSHA() {
		return oldTreeSHA;
	}

	public void setOldTreeSHA(String oldTreeSHA) {
		this.oldTreeSHA = oldTreeSHA;
	}

	public String getTestDataBlobSHA() {
		return testDataBlobSHA;
	}

	public void setTestDataBlobSHA(String testDataBlobSHA) {
		this.testDataBlobSHA = testDataBlobSHA;
	}

	public String getTestDataMetaBlobSHA() {
		return testDataMetaBlobSHA;
	}

	public void setTestDataMetaBlobSHA(String testDataMetaBlobSHA) {
		this.testDataMetaBlobSHA = testDataMetaBlobSHA;
	}

	public String getCreatedFilesGitTreeSHA() {
		return createdFilesGitTreeSHA;
	}

	public void setCreatedFilesGitTreeSHA(String createdFilesGitTreeSHA) {
		this.createdFilesGitTreeSHA = createdFilesGitTreeSHA;
	}

	public String getNewCommitSHA() {
		return newCommitSHA;
	}

	public void setNewCommitSHA(String newCommitSHA) {
		this.newCommitSHA = newCommitSHA;
	}

	public String getPullRequestUrl() {
		return pullRequestUrl;
	}

	public void setPullRequestUrl(String pullRequestUrl) {
		this.pullRequestUrl = pullRequestUrl;
	}

}
