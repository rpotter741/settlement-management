# Summary of Tapestries and Story Threads in Eclorean Ledger

## **Concept Overview**

Tapestries and Story Threads form the narrative backbone of Eclorean Ledger, empowering DMs to create dynamic, interconnected stories. They use **Events**, **Hooks**, and **Links** to craft emergent storytelling experiences that respond to player actions and settlement states.

---

## **Core Concepts**

### **Story Threads**

- **Definition:** Focused narrative arcs, either linear or branching, that guide the flow of a campaign.
- **Components:** Built using interconnected **Events**, with Hooks and Links determining progression.
- **Key Features:**
  - Narrative-driven.
  - Often tied to specific player or settlement goals.
  - Modular and reusable across campaigns.

### **Tapestries**

- **Definition:** A collection of Story Threads that interconnect to form a long-term, epic narrative.
- **Components:** Can reference other threads and events dynamically, including conditional dependencies between threads.
- **Key Features:**
  - Represents the "big picture" of the campaign.
  - Enables large-scale emergent storytelling.
  - Handles nested and cross-thread logic.

---

## **Canvas-Based UI**

### **Node System**

- **Events as Nodes:**
  - Each event is a draggable node placed on the canvas.
  - Provides an overview of the event's details, such as:
    - Event Name
    - Type (e.g., Climax, Path)
    - Current Phase
  - Clicking on a node opens the Event Editor for detailed customization.

### **Connections Between Events**

- **Links (Solid Lines):**

  - Represent direct, immediate progression from one event to another.
  - Useful for fast-paced, linear sequences.
  - **Condition Block:** Optional logic can be added to Links (e.g., "Trigger only if Safety < 50").

- **Hooks (Dotted Lines):**
  - Represent conditional progression that depends on settlement state, player actions, or other factors.
  - Allow for pacing and dynamic branching.
  - **Condition Block:** Defines the criteria for activation (e.g., "Activate if Hunger > 30").

### **Conditional Blocks**

- **AND/OR Logic:**
  - Combine multiple conditions to create nuanced triggers.
- **Attribute Integration:**
  - Pull from settlement attributes, statuses, and APT milestones.
- **Custom Rules:**
  - Enable advanced users to create specific conditions for Links or Hooks.

### **Visual Customization**

- **Color-Coded Paths:**
  - Automatically assign colors by path, but users can customize palettes for clarity.
- **Dynamic Labels:**
  - Show key conditions or summaries on lines connecting nodes.

---

## **Tapestry-Specific Features**

### **Nested Story Threads**

- **Thread Referencing:**

  - Allow users to link Story Threads within Tapestries.
  - Example: A "Flood Relief" thread references the "Flood Warning" thread dynamically based on unresolved Hooks.

- **Dynamic Referencing:**
  - Conditional toggles in the Tapestry can check for Hooks or statuses from referenced threads.
  - Example: Activate "Diplomatic Breakdown" if "Food Shortage" is unresolved in another thread.

### **Canvas Layers**

- **Layer 1:** High-level Tapestry view showing inter-thread relationships.
- **Layer 2:** Detailed view of individual threads and their events.

### **Summary Dashboard**

- Provides an overview of:
  - Total Threads and Events.
  - Resolved vs. Unresolved Hooks.
  - Progress metrics (e.g., "Plague Spread APT at 60%").

---

## **Dynamic Narrative Integration**

### **Dynamic Climax Events**

- **Definition:** Events that adapt their descriptions and outcomes based on resolved/unresolved Hooks.
- **Example:**
  - "Flood Warning":
    - If "Reinforce Riverbanks" Hook is resolved: "The floodwaters were controlled, and minimal damage occurred."
    - If unresolved: "A deluge swept through the settlement, leaving destruction in its wake."

### **Settlement-Specific Projects**

- Events can introduce projects tied to specific Hooks:
  - Example Projects:
    - "Reinforce Riverbanks": Requires 10 Stone and 5 Worker Actions.
    - "Evacuate Villagers": Consumes 5 Food per turn.
  - Projects directly influence the narrative outcomes of Climax Events.

### **Tailored Actions**

- Player actions dynamically appear in the interface based on the event:
  - Example:
    - "Flood Warning" displays actions like "Build Defenses" or "Stockpile Materials."
  - Actions update Hook statuses in real time.

---

## **Development Considerations**

### **Scalability**

- **Progressive Disclosure:**

  - Hide advanced options behind collapsible menus or tabs.
  - Start with simple Links and Hooks; expose conditional logic as needed.

- **Zoom and Pan Controls:**
  - Enable easy navigation for large Tapestries.

### **Clarity and Accessibility**

- **Terminology:** Use clear, user-friendly terms (e.g., "Hooks" instead of "Hook-In/Out").
- **Visual Indicators:**
  - Statuses of Hooks and Links are color-coded for clarity.
  - Include visual aids like minimaps or heatmaps.

### **Community and Collaboration**

- **Content Sharing:**
  - Enable users to share Story Threads, Tapestries, and listener packs.
- **Templates and Prebuilts:**
  - Provide templates for common narrative structures (e.g., branching paths, escalating crises).

---

## **Closing Thoughts**

Tapestries and Story Threads are the heart of Eclorean Ledger’s narrative design. With a canvas-based interface, dynamic Hooks, and nested logic, they offer DMs unparalleled tools to craft living, reactive worlds. By balancing complexity with intuitive design, the system ensures that both beginners and advanced users can create and manage their campaigns seamlessly.
