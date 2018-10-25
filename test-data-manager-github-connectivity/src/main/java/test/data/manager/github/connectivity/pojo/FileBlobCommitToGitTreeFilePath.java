package test.data.manager.github.connectivity.pojo;

public class FileBlobCommitToGitTreeFilePath {

	private String path;

	private final String mode = "100644";

	private final String type = "blob";

	private String sha;

	public String getPath() {
		return path;
	}

	public void setPath(String path) {
		this.path = path;
	}

	public String getMode() {
		return mode;
	}

	public String getType() {
		return type;
	}

	public String getSha() {
		return sha;
	}

	public void setSha(String sha) {
		this.sha = sha;
	}
}
