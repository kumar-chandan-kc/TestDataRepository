package test.data.manager.github.connectivity.pojo;

public class FileBlobGitCommitRequestBody {

	private String message;

	private String[] parents = new String[1];

	private String tree;

	public String getMessage() {
		return message;
	}

	public void setMessage(String message) {
		this.message = message;
	}

	public String[] getParents() {
		return parents;
	}

	public void setParents(String[] parents) {
		this.parents = parents;
	}

	public String getTree() {
		return tree;
	}

	public void setTree(String tree) {
		this.tree = tree;
	}

}
