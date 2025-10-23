# Kanban Board & Reports Application

A powerful, feature-rich Kanban board application with advanced reporting capabilities, built with Next.js, React, and TypeScript. Manage your tasks efficiently with drag-and-drop functionality, tags, and comprehensive analytics.

## Features

### 📋 Kanban Board
- **Unlimited Lists & Tasks**: Create as many lists and tasks as you need
- **Drag & Drop**: 
  - Move tasks between lists seamlessly
  - Reorder lists by dragging them
  - Automatic timestamp updates when tasks are moved
- **Collapsible Lists**: Collapse lists to save space - they appear as compact buttons at the top
- **Smart Tags System**:
  - Auto-detect tags in task descriptions using `#tag_name` syntax
  - Each tag gets a unique color for easy identification
  - Click tags on cards to instantly filter tasks
  - Filter by multiple tags simultaneously
- **Task Management**:
  - Add, edit, and delete tasks
  - Track creation and update timestamps
  - Rich task descriptions with tag support

### 📊 Reports & Analytics
- **Text Reports**: Generate formatted text reports for easy sharing
  - Customizable date ranges (weekly, monthly, yearly)
  - Group tasks by list/status
  - Exclude specific lists from reports
  - Copy to clipboard functionality
- **Visual Analytics**:
  - Completion status pie chart
  - Tasks by list bar chart
  - Timeline activity chart
- **Advanced Grouping**:
  - Monthly reports grouped by week
  - Yearly reports grouped by month
- **Flexible Filtering**: Filter by date range, report type, and task status

### 💾 Data Management
- **Local Storage**: All data persists in your browser
- **Export Options**:
  - Export as human-readable text format
  - Export as JSON for complete data backup
- **Import Options**:
  - Import from text reports (adds to existing data without duplicates)
  - Import from JSON (full data restoration)
- **Smart Import**: 
  - Only adds tasks to existing lists
  - Prevents duplicate tasks
  - Non-destructive (doesn't delete existing data)

## Technology Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **UI Components**: shadcn/ui
- **Charts**: Recharts
- **Drag & Drop**: Native HTML5 Drag and Drop API
- **Storage**: Browser Local Storage

## Installation

### Prerequisites
- Node.js 18.x or higher
- npm, yarn, or pnpm

### Setup

1. **Clone or download the repository**
   ```bash
   git clone <repository-url>
   cd kanban-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Deployment

### Deploy to Vercel (Recommended)

Vercel is the easiest way to deploy Next.js applications:

1. **Push your code to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin <your-github-repo-url>
   git push -u origin main
   ```

2. **Deploy to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository
   - Click "Deploy"

   Or use the Vercel CLI:
   ```bash
   npm i -g vercel
   vercel
   ```

3. **Access your deployed app**
   Vercel will provide you with a production URL (e.g., `your-app.vercel.app`)

### Deploy to Other Platforms

#### Netlify
```bash
npm run build
# Deploy the .next folder
```

#### Docker
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

Build and run:
```bash
docker build -t kanban-app .
docker run -p 3000:3000 kanban-app
```

#### Static Hosting
For static export (note: some features may be limited):
```bash
npm run build
# Deploy the 'out' folder to any static hosting service
```

## Use Cases

### 1. Personal Task Management
**Scenario**: Individual tracking daily tasks and projects

**Workflow**:
- Create lists: "Backlog", "Today", "In Progress", "Done"
- Add tasks with tags like `#urgent`, `#personal`, `#work`
- Drag tasks through your workflow as you complete them
- Use weekly reports to review accomplishments
- Filter by `#work` to focus on professional tasks

**Benefits**: Clear visual overview of personal productivity, automatic time tracking

### 2. Software Development Team
**Scenario**: Agile team managing sprint tasks

**Workflow**:
- Create lists: "Backlog", "To Do", "In Progress", "Code Review", "Testing", "Done"
- Add user stories with tags like `#frontend`, `#backend`, `#bug`, `#feature`
- Team members move tasks as they work on them
- Generate weekly reports grouped by week for sprint reviews
- Export text reports for standup meetings
- Filter by `#bug` to see all bug-related tasks

**Benefits**: Real-time collaboration visibility, sprint retrospective data, easy status reporting

### 3. Content Creation Pipeline
**Scenario**: Content team managing blog posts, videos, and social media

**Workflow**:
- Create lists: "Ideas", "Research", "Writing", "Editing", "Published"
- Tag content: `#blog`, `#video`, `#social`, `#seo`
- Move content pieces through production stages
- Generate monthly reports grouped by week to track output
- Exclude "Ideas" list from reports to focus on completed work
- Click `#blog` tag to see all blog-related content

**Benefits**: Content pipeline visibility, production metrics, editorial calendar insights

### 4. Event Planning
**Scenario**: Planning a conference or wedding

**Workflow**:
- Create lists: "Ideas", "To Book", "Booked", "In Progress", "Completed"
- Add tasks with tags: `#venue`, `#catering`, `#entertainment`, `#decorations`
- Track vendor bookings and task completion
- Generate reports to share progress with stakeholders
- Export data as backup before the event
- Filter by `#urgent` to prioritize critical tasks

**Benefits**: Organized planning process, progress tracking, stakeholder communication

### 5. Academic Research Project
**Scenario**: PhD student managing research tasks

**Workflow**:
- Create lists: "Literature Review", "Experiments", "Analysis", "Writing", "Published"
- Tag tasks: `#methodology`, `#data`, `#writing`, `#revision`
- Track research activities over months/years
- Generate yearly reports grouped by month for advisor meetings
- Export JSON backups of research progress
- Import previous semester's tasks to continue work

**Benefits**: Long-term project tracking, academic progress documentation, milestone visibility

### 6. Home Renovation Project
**Scenario**: Homeowner managing renovation tasks

**Workflow**:
- Create lists: "Planning", "Get Quotes", "Scheduled", "In Progress", "Complete"
- Tag by room: `#kitchen`, `#bathroom`, `#bedroom`
- Tag by type: `#plumbing`, `#electrical`, `#painting`
- Track contractor work and completion dates
- Generate reports to monitor budget and timeline
- Click `#kitchen` to see all kitchen-related tasks

**Benefits**: Project organization, contractor coordination, timeline tracking

### 7. Sales Pipeline Management
**Scenario**: Sales team tracking leads and deals

**Workflow**:
- Create lists: "Leads", "Contacted", "Proposal Sent", "Negotiation", "Closed"
- Tag deals: `#enterprise`, `#smb`, `#hot-lead`, `#follow-up`
- Move prospects through sales stages
- Generate monthly reports to track conversion rates
- Filter by `#hot-lead` for priority follow-ups
- Export weekly reports for sales meetings

**Benefits**: Visual sales pipeline, conversion tracking, team performance metrics

### 8. Recipe Development (Food Blogger)
**Scenario**: Food blogger developing and testing recipes

**Workflow**:
- Create lists: "Ideas", "Testing", "Photographing", "Writing", "Published"
- Tag recipes: `#dessert`, `#vegan`, `#quick`, `#seasonal`
- Track recipe development from concept to publication
- Generate monthly reports to plan content calendar
- Filter by `#seasonal` to plan holiday content
- Export text reports for content planning meetings

**Benefits**: Content pipeline management, seasonal planning, publication tracking

## Data Format

### Text Report Format
```
DD/MM/YYYY - DD/MM/YYYY
List Name 1:
  - Task description 1
  - Task description 2
List Name 2:
  - Task description 3
```

### JSON Format
Complete data structure including:
- Lists (id, name, order, collapsed state)
- Tasks (id, description, tags, timestamps, list assignment)
- All metadata and relationships

## Browser Compatibility

- Chrome/Edge: ✅ Full support
- Firefox: ✅ Full support
- Safari: ✅ Full support
- Mobile browsers: ✅ Responsive design

## Data Privacy

All data is stored locally in your browser's Local Storage. No data is sent to external servers. Your tasks and reports remain completely private on your device.

## Tips & Best Practices

1. **Use Tags Effectively**: Add tags like `#urgent`, `#important`, or `#quick-win` to prioritize tasks
2. **Regular Backups**: Export JSON backups weekly to prevent data loss
3. **Collapse Unused Lists**: Keep your board clean by collapsing lists you're not actively using
4. **Consistent Naming**: Use consistent list names across projects for easier reporting
5. **Weekly Reviews**: Generate weekly reports to review progress and plan ahead
6. **Filter Smart**: Use tag filtering to focus on specific types of work

## Troubleshooting

**Tasks not saving?**
- Check if Local Storage is enabled in your browser
- Clear browser cache and reload
- Export data before clearing cache

**Drag and drop not working?**
- Ensure you're using a modern browser
- Try refreshing the page
- Check if browser extensions are interfering

**Reports showing incorrect data?**
- Verify date range selection
- Check if lists are excluded from the report
- Ensure tasks have proper timestamps

## Contributing

Contributions are welcome! Please feel free to submit issues or pull requests.

## License

MIT License - feel free to use this project for personal or commercial purposes.

## Support

For issues, questions, or feature requests, please open an issue on the GitHub repository.

---

Built with ❤️ using Next.js and TypeScript
