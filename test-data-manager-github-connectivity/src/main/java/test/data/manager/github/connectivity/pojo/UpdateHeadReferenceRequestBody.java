package test.data.manager.github.connectivity.pojo;

public class UpdateHeadReferenceRequestBody {

	private String sha;

	private final boolean force = true;

	public String getSha() {
		return sha;
	}

	public void setSha(String sha) {
		this.sha = sha;
	}

	public boolean isForce() {
		return force;
	}
}
