export const skillbadges: App.JuaraBadge[] = [
	{ courseid: 674, title: 'Automate Data Capture at Scale with Document AI' },
	{ courseid: 1076, title: 'Build Real World AI Applications with Gemini and Imagen' },
	{ courseid: 626, title: 'Create ML Models with BigQuery ML' },
	{ courseid: 978, title: 'Develop Gen AI Apps with Gemini and Streamlit' },
	{ courseid: 959, title: 'Explore Generative AI with the Gemini API in Vertex AI' },
	{ courseid: 696, title: 'Cloud Run Functions: 3 Ways' },
	{ courseid: 702, title: 'Configure Service Accounts and IAM Roles for Google Cloud' },
	{ courseid: 741, title: 'Develop Serverless Applications on Cloud Run' },
	{ courseid: 627, title: 'Engineer Data for Predictive Modeling with BigQuery ML' },
	{ courseid: 645, title: 'Implement Cloud Security Fundamentals on Google Cloud' },
	{ courseid: 759, title: 'Implement Multimodal Vector Search with BigQuery' },
	{ courseid: 981, title: 'Inspect Rich Documents with Gemini Multimodality and Multimodal RAG' },
	{ courseid: 759, title: 'Mitigate Threats and Vulnerabilities with Security Command Center' },
	{ courseid: 749, title: 'Monitor and Log with Google Cloud Observability' },
	{ courseid: 747, title: 'Monitoring in Google Cloud' },
	{ courseid: 656, title: 'Perform Predictive Data Analysis in BigQuery' },
	{ courseid: 631, title: 'Prepare Data for ML APIs on Google Cloud' },
	{ courseid: 976, title: 'Prompt Design in Vertex AI' },
	{ courseid: 755, title: 'Use APIs to Work with Cloud Storage' },
	{ courseid: 630, title: 'Use Machine Learning APIs on Google Cloud' }
].map((b) => ({ ...b, type: 'skill' }));

export const regularbadges: App.JuaraBadge[] = [
	{ courseid: 1159, title: 'Agent Assist and its Gen AI Capabilities' },
	{ courseid: 1371, title: 'AI Boost Bites: Automate tasks with Gemini and Apps Script' },
	{ courseid: 1436, title: 'Build AI Agents with Enterprise Databases' },
	{ courseid: 1162, title: 'Build Generative AI Agents with Vertex AI and Flutter' },
	{ courseid: 1382, title: 'Build intelligent agents with Agent Development Kit (ADK)' },
	{ courseid: 1122, title: 'Create Agents with Generative Playbooks' },
	{ courseid: 1210, title: 'Create Embeddings, Vector Search, and RAG with BigQuery' },
	{ courseid: 1445, title: 'Deploy Multi-Agent Architectures' },
	{
		courseid: 1275,
		title: 'Deploy Multi-Agent Systems with Agent Development Kit (ADK) and Agent Engine'
	},
	{ courseid: 881, title: 'Gemini for Application Developers' },
	{ courseid: 878, title: 'Gemini for Cloud Architects' },
	{ courseid: 882, title: 'Gemini for DevOps Engineers' },
	{ courseid: 884, title: 'Gemini for Network Engineers' },
	{ courseid: 886, title: 'Gemini for Security Engineers' },
	{ courseid: 1147, title: 'Introduction to Security in the World of AI' },
	{ courseid: 1399, title: 'Kickstarting Application Development with Gemini Code Assist' },
	{ courseid: 1385, title: 'Model Armor: Securing AI Deployments' },
	{ courseid: 1166, title: 'Streamline App Development with Gemini Code Assist' },
	{ courseid: 939, title: 'Vector Search and Embeddings' },
	{ courseid: 391, title: 'Vertex AI Search for Commerce' }
].map((b) => ({ ...b, type: 'completion' }));
