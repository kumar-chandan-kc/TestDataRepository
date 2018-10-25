package test.data.manager.github.connectivity.pojo;

import java.util.ArrayList;

public class TestDataMeta {

	private String fileName;

	private ArrayList<TestDataInstanceKey> keys;

	public String getFileName() {
		return fileName;
	}

	public void setFileName(String fileName) {
		this.fileName = fileName;
	}

	public ArrayList<TestDataInstanceKey> getKeys() {
		return keys;
	}

	public void setKeys(ArrayList<TestDataInstanceKey> keys) {
		this.keys = keys;
	}

}
