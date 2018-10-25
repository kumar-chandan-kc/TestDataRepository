package test.data.manager.email.connectivity.pojo;

public class EmailMessageRequestBody {

	private String recipients;

	private String githubPath;

	public String getRecipients() {
		return recipients;
	}

	public void setRecipients(String recipients) {
		this.recipients = recipients;
	}

	public String getGithubPath() {
		return githubPath;
	}

	public void setGithubPath(String githubPath) {
		this.githubPath = githubPath;
	}

}
