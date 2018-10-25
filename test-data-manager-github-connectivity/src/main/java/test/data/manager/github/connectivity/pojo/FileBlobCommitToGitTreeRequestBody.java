package test.data.manager.github.connectivity.pojo;

import java.util.ArrayList;
import java.util.List;

public class FileBlobCommitToGitTreeRequestBody {

	private String base_tree;

	private List<FileBlobCommitToGitTreeFilePath> tree = new ArrayList<FileBlobCommitToGitTreeFilePath>();

	public String getBase_tree() {
		return base_tree;
	}

	public void setBase_tree(String base_tree) {
		this.base_tree = base_tree;
	}

	public List<FileBlobCommitToGitTreeFilePath> getTree() {
		return tree;
	}

	public void setTree(List<FileBlobCommitToGitTreeFilePath> tree) {
		this.tree = tree;
	}

	public void addTreeEndtry(FileBlobCommitToGitTreeFilePath fileBlobCommitToGitTreeFilePath) {
		this.tree.add(fileBlobCommitToGitTreeFilePath);
	}

}
