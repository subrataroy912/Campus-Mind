export  const mockDiscussions = [
    {
        "id": "disc-1",
        "title": "How to handle consensus timeouts in Raft replication?",
        "preview": "When a follower node misses two consecutive heartbeats, should it trigger an immediate election or wait for the randomized backoff period?",
        "classroomName": "Distributed Systems & Cloud",
        "classroomId": "cls-1",
        "repliesCount": 8,
        "upvotes": 14,
        "hasAcceptedAnswer": true,
        "createdAt": "2h ago"
    },
    {
        "id": "disc-2",
        "title": "Optimizing B-Tree page splits for high-throughput write workloads",
        "preview": "We are experiencing severe write amplification during peak hours. Would moving from a 50/50 split to a right-leaning split strategy mitigate this?",
        "classroomName": "Advanced Database Systems",
        "classroomId": "cls-2",
        "repliesCount": 3,
        "upvotes": 9,
        "hasAcceptedAnswer": false,
        "createdAt": "5h ago"
    },
    {
        "id": "disc-3",
        "title": "TCP congestion control: BBR vs Cubic in high-latency satellite links",
        "preview": "Our packet loss rate spikes significantly over the temporary uplink. Has anyone successfully tuned BBR pacing parameters to prevent premature window throttling?",
        "classroomName": "Computer Networks",
        "classroomId ": "cls-3",
        "repliesCount": 12,
        "upvotes": 22,
        "hasAcceptedAnswer": true,
        "createdAt": "1d ago"
    },
    {
        "id": "disc-4",
        "title": "Deadlock risks with reentrant locks in nested async functions",
        "preview": "I am observing occasional thread starvation when an async event loop handler tries to re-acquire a mutex already held by its parent context.",
        "classroomName": "Distributed Systems & Cloud",
        "classroomId": "cls-1",
        "repliesCount": 0,
        "upvotes": 2,
        "hasAcceptedAnswer": false,
        "createdAt": "3d ago"
    }
]