export const REPUTATION_BADGES = {
  SCHOLAR: {
    id: "SCHOLAR",
    title: "Campus Scholar",
    iconName: "GraduationCap",
    badgeClass: "text-blue-600 dark:text-blue-400 bg-blue-500/10 border-blue-500/20",
    description: "Awarded for insightful study notes and helpful answers",
    criteria: "Earn 10+ Brilliant or Spot-on peer reactions",
  },
  CONTRIBUTOR: {
    id: "CONTRIBUTOR",
    title: "Top Contributor",
    iconName: "Zap",
    badgeClass: "text-purple-600 dark:text-purple-400 bg-purple-500/10 border-purple-500/20",
    description: "Active contributor across classes, discussions, and study groups",
    criteria: "Participate in 15+ campus discussions",
  },
  STREAK_MASTER: {
    id: "STREAK_MASTER",
    title: "Streak Master",
    iconName: "Flame",
    badgeClass: "text-amber-600 dark:text-amber-400 bg-amber-500/10 border-amber-500/20",
    description: "Maintained a 7+ day continuous campus learning streak",
    criteria: "Log in and engage for 7 consecutive days",
  },
  PULSE_PIONEER: {
    id: "PULSE_PIONEER",
    title: "Pulse Pioneer",
    iconName: "Vote",
    badgeClass: "text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
    description: "Leading participant and voter in campus polls and community surveys",
    criteria: "Vote or create 5+ campus polls",
  },
};

export const DEFAULT_USER_ACHIEVEMENTS = {
  reputationPoints: 480,
  level: "Senior Scholar",
  unlockedBadgeIds: ["SCHOLAR", "STREAK_MASTER", "PULSE_PIONEER"],
  stats: {
    reactionsReceived: 78,
    pollsParticipated: 12,
    helpfulAnswers: 16,
    discussionsJoined: 24,
  },
};
