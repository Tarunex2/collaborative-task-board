const defaultBoardData = {

    website: {
        title: "Website Project",
        lists: [
            {
                name: "To Do",
                tasks: [
                    {
                        title: "Design Homepage",
                        description: "Create the homepage layout.",
                        assignedTo: "Tarun Chuphal"
                    },
                    {
                        title: "Create Navbar",
                        description: "Build responsive navigation.",
                        assignedTo: "Yuvika Bhat"
                    },
                    {
                        title: "Choose Colors",
                        description: "Select the website color palette.",
                        assignedTo: "Rudra Kathait"
                    }
                ]
            },
            {
                name: "In Progress",
                tasks: [
                    {
                        title: "Build Product Page",
                        description: "Create product page UI.",
                        assignedTo: "Tarun Chuphal"
                    },
                    {
                        title: "Login Page",
                        description: "Design the login screen.",
                        assignedTo: "Yuvika Bhat"
                    }
                ]
            },
            {
                name: "Done",
                tasks: [
                    {
                        title: "Project Setup",
                        description: "Created the basic project structure.",
                        assignedTo: "Tarun Chuphal"
                    },
                    {
                        title: "Requirements",
                        description: "Reviewed project requirements.",
                        assignedTo: "Rudra Kathait"
                    }
                ]
            }
        ]
    },


    marketing: {
        title: "Marketing Project",
        lists: [
            {
                name: "Ideas",
                tasks: [
                    {
                        title: "Instagram Campaign",
                        description: "Plan the Instagram campaign.",
                        assignedTo: "Tarun Chuphal"
                    },
                    {
                        title: "Create Banner",
                        description: "Design a marketing banner.",
                        assignedTo: "Yuvika Bhat"
                    }
                ]
            },
            {
                name: "In Progress",
                tasks: [
                    {
                        title: "Social Media Posts",
                        description: "Prepare social media content.",
                        assignedTo: "Rudra Kathait"
                    }
                ]
            },
            {
                name: "Done",
                tasks: [
                    {
                        title: "Marketing Plan",
                        description: "Create the initial marketing plan.",
                        assignedTo: "Tarun Chuphal"
                    }
                ]
            }
        ]
    },


    personal: {
        title: "Personal Tasks",
        lists: [
            {
                name: "To Do",
                tasks: [
                    {
                        title: "Learn JavaScript",
                        description: "Practice JavaScript concepts.",
                        assignedTo: "Tarun Chuphal"
                    },
                    {
                        title: "Practice CSS",
                        description: "Practice responsive CSS.",
                        assignedTo: "Tarun Chuphal"
                    }
                ]
            },
            {
                name: "In Progress",
                tasks: [
                    {
                        title: "Build Task Board",
                        description: "Continue working on the project.",
                        assignedTo: "Tarun Chuphal"
                    }
                ]
            },
            {
                name: "Done",
                tasks: [
                    {
                        title: "HTML Practice",
                        description: "Complete basic HTML practice.",
                        assignedTo: "Tarun Chuphal"
                    }
                ]
            }
        ]
    }

};


/* Load saved data if available */

const savedBoardData =
    localStorage.getItem("taskBoardData");

const boardData =
    savedBoardData
        ? JSON.parse(savedBoardData)
        : defaultBoardData;