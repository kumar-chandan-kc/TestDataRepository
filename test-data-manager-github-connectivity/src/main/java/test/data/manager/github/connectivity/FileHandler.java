package test.data.manager.github.connectivity;

import javax.servlet.http.HttpServletResponse;

import test.data.manager.github.connectivity.constants.RequestType;
import test.data.manager.github.connectivity.pojo.NewGitCommitDetail;
import test.data.manager.github.connectivity.pojo.RequestDetail;

public class FileHandler {

	public static void commitFile(RequestDetail requestDetail, HttpServletResponse response) throws Exception {
		NewGitCommitDetail newGitCommitDetail = new NewGitCommitDetail();
		newGitCommitDetail.setGitRepoLastCommitSHA(GitHubConnector.fetchLastCommit());
		newGitCommitDetail.setNewBranchName(
				GitHubConnector.createNewFeatureBranchForTheCommit(newGitCommitDetail.getGitRepoLastCommitSHA()));
		newGitCommitDetail.setOldTreeSHA(
				GitHubConnector.fetchSHAofGitTreeFromLastCommitUrl(newGitCommitDetail.getGitRepoLastCommitSHA()));
		newGitCommitDetail.setTestDataBlobSHA(GitHubConnector.createFileAsBlob(requestDetail, RequestType.TestData));
		requestDetail.getTestDataRepository().getTestDataMeta().get(0)
				.setFileName(java.util.UUID.randomUUID() + "_data.json");
		GitHubConnector.appendTestDataMetaWithPreviousMetaInRepository(requestDetail);
		newGitCommitDetail
				.setTestDataMetaBlobSHA(GitHubConnector.createFileAsBlob(requestDetail, RequestType.TestDataMeta));
		newGitCommitDetail.setCreatedFilesGitTreeSHA(GitHubConnector.addCreatedFileBlobToGitTree(
				newGitCommitDetail.getOldTreeSHA(), newGitCommitDetail.getTestDataBlobSHA(),
				newGitCommitDetail.getTestDataMetaBlobSHA(), requestDetail));
		newGitCommitDetail.setNewCommitSHA(
				GitHubConnector.submitChangeToGitTreeAsNewCommit(newGitCommitDetail.getCreatedFilesGitTreeSHA(),
						newGitCommitDetail.getGitRepoLastCommitSHA(), requestDetail));
		GitHubConnector.moveHEADReferenceToNewCommit(newGitCommitDetail.getNewCommitSHA(),
				newGitCommitDetail.getNewBranchName());
		newGitCommitDetail.setPullRequestUrl(GitHubConnector.createPullRequestFromNewBranchToMaster(
				newGitCommitDetail.getNewBranchName(), requestDetail.getTestDataRepository().getComments()));
		// send mail for test data review
		if (!requestDetail.getTestDataRepository().getReviewers().isEmpty())
			MailSender.sendTestDataReviewMail(requestDetail.getTestDataRepository(),
					newGitCommitDetail.getPullRequestUrl());
	}

}
