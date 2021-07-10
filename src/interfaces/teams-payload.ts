export interface TeamsPayload {
    '@type': string;
    '@context': string;
    themeColor: string;
    title: string;
    summary: string;
    text?: string;
    sections?: Section[];
    potentialAction?: Action[];
}

interface Section {
    facts: Fact[];
}

interface Fact {
    name: string;
    value: string;
}

interface Action {
    '@type': string;
    name: string;
    targets: Target[];
}

interface Target {
    os: string;
    uri: string;
}
