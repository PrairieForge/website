import {
  Check,
  Church,
  Component,
  Cross,
  DollarSign,
  Dumbbell,
  Glasses,
  HeartHandshake,
} from "@lucide/astro";

export const internshipDescription = [
  {
    id: "church-hosted",
    icon: Church,
    title: "Church-Hosted",
    description:
      "A host church will provide the primary context for ministry practice as the intern is immersed in normal ministry activities (elder meetings, member visits, Sunday School, small groups, membership classes, prayer gatherings, preaching, hospitality, etc.). Each intern will have a supervising pastor-mentor.",
  },
  {
    id: "cohort-based",
    icon: Component,
    title: "Cohort-Based",
    description:
      "Interns will take part in a cohort spread throughout participating churches. The cohort will gather weekly to discuss and reflect on practical ministry topics as experienced in the local church setting. These discussions will focus on the five areas of the Prairie Forge vision: (1) Big God Theology, (2) Persuasive Preaching, (3) Intentional Ecclesiology, (4) Compelling Culture, and (5) Deliberately Rural Mission.",
  },
  {
    id: "fully-funded",
    icon: DollarSign,
    title: "Fully-Funded",
    description:
      "The host church will provide a stipend for the internship. The host church will also coordinate with the intern to secure housing. This position requires a minimum of 20 hours per week. To maximize learning, interns are encouraged to take part in as much local church ministry as possible.",
  },
];

export const internshipBenefits = [
  {
    id: "self-assessment",
    icon: Glasses,
    title: "Self-Assessment",
    description:
      "The intern will reflect on his desire and preparedness for pastoral ministry in general. The intern will also assess his own fitness for ministry in normative-size churches in small places.",
  },
  {
    id: "practical-training",
    icon: Dumbbell,
    title: "Practical Training",
    description:
      "The intern will receive mentoring from a supervising pastor. Through guided reading, discussion, and participation in essential areas of pastoral ministry, the intern will grow in pastoral competence.",
  },
  {
    id: "external-assessment",
    icon: Check,
    title: "External Assessment and Affirmation",
    description:
      "The supervising pastor and local church will assess the intern's gifts and calling to pastoral ministry. Lord willing, by the end of the summer, the local church will be ready to affirm the intern for further training and pursuit of ministry.",
  },
  {
    id: "participation-in-healthy-church",
    icon: Cross,
    title: "Participation in the Life of a Healthy Church",
    description:
      "The intern will enjoy the loving support of a local church, which assumes the responsibility for his care and training. Through participation in the weekly church rhythms, the intern will be encouraged as he explores his calling.",
  },
  {
    id: "blessing-to-church",
    icon: HeartHandshake,
    title: "Blessing to the Local Church",
    description:
      "The intern and the local church will have a mutually beneficial relationship. The intern will meet pastoral needs in the church, and the church will be blessed as they hospitably welcome the intern.",
  },
];
