import { createGlobalState } from "@vueuse/core"
import { driver } from "driver.js"

export const useTourStore = createGlobalState(() => {
  const openConfiguration = ref(false)
  const dummyProject = ref<string>()
  const tour = driver({
    disableActiveInteraction: true,
    showProgress: true,
    onDestroyStarted: () => {
      if (!tour.hasNextStep() || confirm("Do you want to abort the guided tour?")) {
        tour.destroy();
      }
    },
    steps: [
      {
        element: "#configuration-button",
        popover: {
          description: "Start by setting up the basic configuration.",
          onNextClick: () => {
            openConfiguration.value = true
            setTimeout(() => {
              tour.moveNext()
            }, 1)
          },
        },
      },
      {
        element: "#general-options",
        popover: {
          description: "Activate general options.",
        },
      },
      {
        element: "#parse-tickets-button",
        popover: {
          title: "Configuration",
          description:
            "Enable parsing ticket numbers in description. Optionally configure the regular expression used for parsing.",
        },
      },
      {
        element: "#work-hours-input",
        popover: {
          title: "Configuration",
          description: "Set work hours per day to enable calculating overtime.",
        },
      },
      {
        element: "#overtime-baseline-input",
        popover: {
          title: "Configuration",
          description:
            "Set overtime baseline to correct overtime deviation due to pre-existing time entries.",
          onNextClick: () => {
            openConfiguration.value = false
            setTimeout(() => {
              tour.moveNext()
            }, 1)
          },
        },
      },
      {
        element: "#add-project-input",
        popover: {
          title: "Projects",
          description: "Add new projects to the list.",
          onNextClick: () => {
            dummyProject.value = "My Project"
            setTimeout(() => {
              tour.moveNext()
            }, 1)
          },
        },
      },
      {
        element: "#dummy-project",
        popover: {
          title: "Projects",
          description:
            "Select a project to automatically create a new timestamp with this project.",
        },
      },
      {
        element: "#dummy-project-delete",
        popover: {
          title: "Projects",
          description: "Remove obsolete projects.",
          onNextClick: () => {
            dummyProject.value = undefined
            setTimeout(() => {
              tour.moveNext()
            }, 1)
          },
        },
      },
      {
        element: "#week-statistics",
        popover: {
          title: "Statistics",
          description:
            "See an overview of how many hours you have worked on each project for this week",
        },
      },
    ],
  })
  return {
    tour,
    openConfiguration,
    dummyProject,
  }
})
