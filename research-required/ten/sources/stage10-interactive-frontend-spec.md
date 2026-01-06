# Stage 10: Interactive Frontend & Intelligence Dashboard

## Overview
Simple, clean web interface for exploring Web3 privacy intelligence with integrated search, local LLM assistance (Ollama), data visualization, and Web3Privacy branded design (via Figma MCP).

## Architecture

### Technology Stack
- **Frontend**: React + TypeScript + Tailwind CSS
- **Search**: MiniSearch (client-side full-text search)
- **LLM**: Ollama (self-hosted, cloud deployment)
- **Data Viz**: D3.js + Chart.js + React Flow
- **Design**: Figma MCP integration for branded components
- **Backend**: FastAPI (Python) for LLM proxy and data serving
- **Deployment**: Docker Compose (frontend + Ollama + API)

### Components

#### 1. Search Engine
```typescript
// Client-side search across all project cards
interface SearchEngine {
  indexProjects(): void;           // Index all JSON files
  indexPersonnel(): void;          // Index personnel cards
  indexOSINT(): void;             // Index OSINT events
  search(query: string): SearchResults;
  filterByCategory(category: string): SearchResults;
  filterByTag(tag: string): SearchResults;
  filterByOpSecScore(min: number, max: number): SearchResults;
}
```

**Searchable Fields:**
- Project names, descriptions, categories
- Team member names, roles, expertise
- Technology tags, development status
- OSINT event types, findings
- Security assessment summaries
- GitHub repositories, links

#### 2. LLM Assistant (Ollama)
```python
# Ollama server running in cloud
# Model: mistral:7b-instruct (good balance of speed/quality)

class IntelligenceAssistant:
    """LLM assistant for answering questions about privacy projects"""

    def __init__(self, ollama_url: str):
        self.client = ollama.Client(ollama_url)
        self.context = self._load_project_context()

    async def answer_question(self, question: str) -> str:
        """Answer questions using project intelligence data"""
        relevant_context = self._retrieve_relevant_projects(question)
        prompt = self._build_prompt(question, relevant_context)
        response = await self.client.generate(
            model="mistral:7b-instruct",
            prompt=prompt,
            context=self.context
        )
        return response

    def sort_projects(self, criteria: str) -> List[Project]:
        """Use LLM to intelligently sort projects"""
        # Examples: "most mature", "best OpSec", "most active development"

    def create_visualization(self, request: str) -> VizConfig:
        """Generate data viz config from natural language"""
        # Example: "show me privacy projects by OpSec score"
```

**LLM Capabilities:**
- Answer questions: "Which projects have the best OpSec?"
- Compare projects: "Compare Aztec and Railgun privacy approaches"
- Summarize findings: "Summarize security issues across all projects"
- Sort and filter: "Show me DeFi projects with active development"
- Generate visualizations: "Create a chart of team sizes"
- Explain concepts: "Explain zero-knowledge proofs in Aztec"

#### 3. Data Visualization Suite

**A. Network Graph**
- Nodes: Projects, people, organizations
- Edges: Team memberships, collaborations, technology shared
- Interactive exploration with zoom/pan
- Powered by React Flow

**B. OpSec Dashboard**
- Bar chart: Projects ranked by OpSec score
- Heatmap: Security finding severity by project
- Timeline: Security events over time

**C. Technology Landscape**
- Bubble chart: Project categories sized by team size
- Tech stack visualization: Common technologies
- Development activity: GitHub commits timeline

**D. Team Network**
- Force-directed graph: Personnel connections
- LinkedIn integration: Professional backgrounds
- Expertise clustering: Skills and domains

**E. OSINT Event Explorer**
- Timeline: All OSINT events chronologically
- Filter by type: DNS, SSL, Email, Social, Threat Intel
- Drill-down: Click event → see full details

#### 4. Web3Privacy Branded UI (Figma MCP)

**Design System Integration:**
```python
# Use Figma MCP to extract design tokens
from figma_mcp import FigmaClient

figma = FigmaClient(token=os.getenv("FIGMA_TOKEN"))

# Extract Web3Privacy design system
design_tokens = figma.get_design_tokens(
    file_id="WEB3PRIVACY_FILE_ID",
    components=["colors", "typography", "spacing", "components"]
)

# Generate Tailwind config
tailwind_config = generate_tailwind_config(design_tokens)

# Export React components
components = figma.export_components([
    "Header", "ProjectCard", "SearchBar", "NavigationMenu",
    "Footer", "DataVizContainer", "LLMChatInterface"
])
```

**Branded Elements:**
- Color palette: Web3Privacy brand colors
- Typography: Brand fonts and hierarchy
- Logo placement: Header, footer, loading screens
- Component library: Cards, buttons, inputs matching brand
- Report templates: Branded PDF export

## User Interface

### Main Layout

```
┌─────────────────────────────────────────────────────────┐
│  Web3Privacy Intelligence Dashboard          [Profile]  │
│  Ethereum Privacy Solutions Report                      │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  [Search: projects, people, tech, findings...]  [Filter]│
│                                                          │
├──────────────┬──────────────────────────────────────────┤
│              │                                           │
│  Categories  │  Project Cards (Grid View)               │
│              │                                           │
│  □ DeFi      │  ┌─────┐ ┌─────┐ ┌─────┐                │
│  □ Tools     │  │Aztec│ │HOPR │ │Rail │                │
│  □ R&D       │  │ 95  │ │ 82  │ │ 88  │                │
│  □ Social    │  └─────┘ └─────┘ └─────┘                │
│              │                                           │
│  OpSec Score │  [Show All 29 Projects]                  │
│  [0────█──100]│                                          │
│              │                                           │
│  Status      │  Data Visualizations                     │
│  □ Active    │  [Network Graph] [OpSec Chart]           │
│  □ Testnet   │  [Team Network]  [Tech Landscape]        │
│              │                                           │
└──────────────┴──────────────────────────────────────────┘
│                                                          │
│  💬 Ask the LLM Assistant                               │
│  "Which projects have the best privacy guarantees?"     │
│  [Send]                                                  │
└─────────────────────────────────────────────────────────┘
```

### Project Detail View

```
┌─────────────────────────────────────────────────────────┐
│  ← Back to Dashboard                                     │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  [Logo]  AZTEC                               OpSec: 95  │
│          Programmable privacy for Ethereum               │
│                                                          │
│  ┌─────────┬─────────┬─────────┬─────────┐             │
│  │Overview │ Team    │ OSINT   │ Security│             │
│  └─────────┴─────────┴─────────┴─────────┘             │
│                                                          │
│  📊 Key Metrics                                         │
│  • Subdomains: 64    • Team Size: 12                    │
│  • IP Addresses: 55  • GitHub Stars: 3.2k               │
│  • OSINT Events: 132 • Active Development: ✅           │
│                                                          │
│  👥 Team Members                                        │
│  [Zac Williamson] [Joe Andrews] [+10 more]              │
│                                                          │
│  🎥 Explainer Video                                     │
│  [▶ Watch Project Overview (2:34)]                      │
│                                                          │
│  📂 Data Exports                                        │
│  [JSON] [CSV] [PDF Report]                              │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

## Implementation Structure

```
frontend/
├── public/
│   └── web3privacy-branding/        # Exported from Figma
├── src/
│   ├── components/
│   │   ├── search/
│   │   │   ├── SearchBar.tsx
│   │   │   ├── SearchResults.tsx
│   │   │   └── FilterPanel.tsx
│   │   ├── projects/
│   │   │   ├── ProjectCard.tsx
│   │   │   ├── ProjectDetail.tsx
│   │   │   └── ProjectGrid.tsx
│   │   ├── visualizations/
│   │   │   ├── NetworkGraph.tsx
│   │   │   ├── OpSecChart.tsx
│   │   │   ├── TeamNetwork.tsx
│   │   │   └── TechLandscape.tsx
│   │   ├── llm/
│   │   │   ├── ChatInterface.tsx
│   │   │   ├── QuestionSuggestions.tsx
│   │   │   └── LLMResponse.tsx
│   │   └── layout/
│   │       ├── Header.tsx
│   │       ├── Sidebar.tsx
│   │       └── Footer.tsx
│   ├── services/
│   │   ├── search.ts              # MiniSearch integration
│   │   ├── ollama.ts              # LLM API client
│   │   ├── dataLoader.ts          # Load JSON files
│   │   └── export.ts              # PDF/CSV export
│   ├── hooks/
│   │   ├── useSearch.ts
│   │   ├── useProjects.ts
│   │   └── useLLMAssistant.ts
│   ├── utils/
│   │   ├── viz.ts                 # D3.js helpers
│   │   └── formatting.ts
│   └── App.tsx
├── tailwind.config.js             # Generated from Figma tokens
└── package.json

backend/
├── api/
│   ├── main.py                    # FastAPI server
│   ├── routes/
│   │   ├── search.py
│   │   ├── llm.py                 # Ollama proxy
│   │   ├── projects.py
│   │   └── export.py
│   └── services/
│       ├── ollama_client.py
│       └── data_service.py
├── Dockerfile
└── requirements.txt

scripts/automation/
└── stage10_frontend_builder.py    # Build and deploy frontend
```

## Data Loading Strategy

```typescript
// Efficient data loading for frontend
class DataLoader {
  async loadProjects(): Promise<Project[]> {
    // Load all project JSON files
    const projects = await Promise.all(
      PROJECT_IDS.map(id =>
        fetch(`/data/project-cards/${id}/discovery_data.json`)
          .then(r => r.json())
      )
    );
    return projects;
  }

  async loadPersonnel(): Promise<Personnel[]> {
    // Load all personnel JSON files
    const personnel = [];
    for (const project of projects) {
      const people = await fetch(
        `/data/project-cards/${project.id}/personnel.json`
      ).then(r => r.json());
      personnel.push(...people);
    }
    return personnel;
  }

  async loadOSINTEvents(): Promise<OSINTEvent[]> {
    // Load OSINT data (may be large, use pagination)
    const events = await fetch('/api/osint/events?limit=1000')
      .then(r => r.json());
    return events;
  }
}
```

## Ollama Deployment

```yaml
# docker-compose-frontend.yml
version: '3.8'

services:
  ollama:
    image: ollama/ollama:latest
    container_name: privacy-intel-ollama
    ports:
      - "11434:11434"
    volumes:
      - ollama-data:/root/.ollama
    environment:
      - OLLAMA_MODELS=mistral:7b-instruct
    restart: unless-stopped

  backend:
    build: ./backend
    container_name: privacy-intel-api
    ports:
      - "8000:8000"
    environment:
      - OLLAMA_URL=http://ollama:11434
      - DATA_PATH=/data
    volumes:
      - ./research-data:/data:ro
    depends_on:
      - ollama
    restart: unless-stopped

  frontend:
    build: ./frontend
    container_name: privacy-intel-frontend
    ports:
      - "3000:3000"
    environment:
      - REACT_APP_API_URL=http://localhost:8000
    depends_on:
      - backend
    restart: unless-stopped

volumes:
  ollama-data:
```

## LLM Prompt Engineering

```python
# System prompt for intelligence assistant
SYSTEM_PROMPT = """You are an expert analyst specializing in Web3 privacy technologies.
You have access to comprehensive intelligence data about Ethereum privacy projects,
including team information, OSINT findings, security assessments, and technical details.

Your role is to:
1. Answer questions accurately using the provided project data
2. Compare and contrast different privacy approaches
3. Identify trends and patterns across projects
4. Explain technical concepts clearly
5. Suggest relevant projects based on user criteria

Always cite specific projects and data points when answering.
If you don't have enough data to answer confidently, say so.

Available data:
- 29 privacy projects with full profiles
- 50-100 team members with work history
- 30,000+ OSINT events
- Security assessments with OpSec scores
- GitHub activity and development metrics
"""

# Example question handling
def build_llm_prompt(question: str, context: List[Project]) -> str:
    return f"""{SYSTEM_PROMPT}

User Question: {question}

Relevant Projects:
{json.dumps([p.to_dict() for p in context], indent=2)}

Please provide a clear, concise answer with specific examples.
"""
```

## Export & Reporting

### PDF Report Generation
```python
from reportlab.lib import colors
from reportlab.lib.pagesizes import letter
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Image

class BrandedReportGenerator:
    """Generate PDF reports with Web3Privacy branding"""

    def generate_project_report(self, project: Project) -> bytes:
        # Use Figma-exported templates
        doc = SimpleDocTemplate("report.pdf", pagesize=letter)
        story = []

        # Header with Web3Privacy logo
        story.append(Image("assets/web3privacy-logo.png", width=200, height=50))
        story.append(Spacer(1, 20))

        # Project overview
        story.append(Paragraph(f"<b>{project.name}</b>", self.styles['Title']))
        story.append(Paragraph(project.description, self.styles['Body']))

        # Team section
        story.append(Paragraph("Team", self.styles['Heading']))
        for member in project.team:
            story.append(Paragraph(f"• {member.name} - {member.role}", self.styles['Body']))

        # Security summary
        story.append(Paragraph("Security Assessment", self.styles['Heading']))
        story.append(Paragraph(f"OpSec Score: {project.opsec_score}/100", self.styles['Body']))

        doc.build(story)
```

## Success Metrics

- ✅ Sub-second search across all 29 projects
- ✅ LLM responds to questions within 3-5 seconds
- ✅ All visualizations render smoothly (60fps)
- ✅ Mobile responsive design
- ✅ Web3Privacy branding throughout
- ✅ Export functionality for all data formats
- ✅ Accessible (WCAG 2.1 AA compliance)

## Development Timeline

1. **Day 1-2**: Setup infrastructure, Figma integration, design tokens
2. **Day 3-4**: Build search engine, data loading, basic UI
3. **Day 5-6**: Integrate Ollama, build LLM chat interface
4. **Day 7-8**: Create data visualizations (network graph, charts)
5. **Day 9-10**: Polish UI, add export functionality, testing
6. **Day 11**: Deploy to production, documentation

## Integration with Master Pipeline

```python
# In master_osint_pipeline.py
async def _stage10_frontend_deployment(self):
    """Stage 10: Build and deploy interactive frontend"""
    self.logger.info("stage10_start", stage="frontend_deployment")

    # 1. Extract Figma design tokens
    from scripts.automation.figma_integration import extract_design_system
    design_tokens = extract_design_system(
        figma_token=os.getenv("FIGMA_TOKEN"),
        file_id=os.getenv("WEB3PRIVACY_FIGMA_FILE")
    )

    # 2. Build frontend
    from scripts.automation.stage10_frontend_builder import FrontendBuilder
    builder = FrontendBuilder(
        data_dir="research-data/project-cards/",
        design_tokens=design_tokens
    )
    await builder.build()

    # 3. Deploy with Docker Compose
    await builder.deploy(
        ollama_model="mistral:7b-instruct",
        port=3000
    )

    self.logger.info("stage10_complete",
                    frontend_url="http://localhost:3000",
                    ollama_status="running")
```

## Privacy & Security

- ✅ No sensitive security data exposed in UI (redacted summaries only)
- ✅ LLM runs locally (no data sent to external services)
- ✅ Read-only data access
- ✅ No user tracking or analytics
- ✅ HTTPS only in production
- ✅ Content Security Policy headers