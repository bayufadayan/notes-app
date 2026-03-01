import { createIcons, icons } from "lucide";
import { NProgress } from "nprogress-v2";
import iziToast from "izitoast";
import { addNote } from "../../utils/notes-manager.js";

class FormView extends HTMLElement {
  connectedCallback() {
    this.render();
    this.attachEventListeners();
    setTimeout(() => createIcons({ icons }), 0);
  }

  render() {
    const now = new Date();
    const formattedDate = now.toLocaleDateString("id-ID", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    const formattedTime = now.toLocaleTimeString("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
    });

    this.innerHTML = `
            <small class="content-date">
                <p><i data-lucide="calendar"></i> ${formattedDate}</p>
                <p><i data-lucide="clock"></i> ${formattedTime}</p>
            </small>
            <form class="notes-form">
                <input
                    type="text"
                    id="note-title"
                    name="title"
                    placeholder="Your Note Title"
                    autocomplete="off"
                    maxlength="50"
                    minlength="1"
                    autofocus
                    required
                />
                <small class="content-word-count">0/50</small>
                <textarea
                    name="content"
                    id="note-content"
                    cols="30"
                    rows="10"
                    placeholder="Write your note here..."
                    required
                ></textarea>
                <button type="submit" class="btn-save-notes">
                    <i data-lucide="save"></i>
                    Save Note
                </button>
            </form>
        `;
  }

  attachEventListeners() {
    const form = this.querySelector(".notes-form");
    const titleInput = this.querySelector("#note-title");
    const contentInput = this.querySelector("#note-content");
    const wordCount = this.querySelector(".content-word-count");

    setTimeout(() => titleInput.focus(), 0);

    titleInput.addEventListener("input", () => {
      const length = titleInput.value.length;
      wordCount.textContent = `${length}/50`;

      if (length > 50) {
        wordCount.style.color = "#ff4d4d";
      } else {
        wordCount.style.color = "#a8a1a1";
      }
    });

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      this.handleSubmit(titleInput.value, contentInput.value);
    });
  }

  async handleSubmit(title, content) {
    if (title.length > 50) {
      iziToast.warning({
        title: "Validation Error",
        message: "Title max 50 characters!",
        position: "topRight",
      });
      return;
    }

    if (!title.trim() || !content.trim()) {
      iziToast.warning({
        title: "Validation Error",
        message: "Title and content cannot be empty!",
        position: "topRight",
      });
      return;
    }

    NProgress.start();

    try {
      const newNote = await addNote(title, content);

      if (newNote) {
        this.querySelector("#note-title").value = "";
        this.querySelector("#note-content").value = "";
        this.querySelector(".content-word-count").textContent = "0/50";

        iziToast.success({
          title: "Success",
          message: "Note saved successfully!",
          position: "topRight",
        });

        window.appSwitchView("note", newNote.id);
      }
    } catch (error) {
      iziToast.error({
        title: "Error",
        message: "Failed to save note. Please try again.",
        position: "topRight",
      });
      console.error("Save error:", error);
    } finally {
      NProgress.done();
    }
  }
}

customElements.define("form-view", FormView);
