export interface TeamsPayload {
    type: string;
    attachments: Attachment[];
}

interface Attachment {
    contentType: string;
    contentUrl: unknown;
    content: AdaptiveCard;
}

interface AdaptiveCard {
    $schema: string;
    type: string;
    version: string;
    body: Element[];
    actions: Action[];
}

type Element = TextBlock | FactSet | ActionSet | ColumnSet | Column;

interface TextBlock {
    type: 'TextBlock';
    text: string;
    weight?: 'default' | 'lighter' | 'bolder';
    size?: 'default' | 'small' | 'medium' | 'large' | 'extraLarge';
}

interface Fact {
    title: string;
    value: string;
}

interface FactSet {
    type: 'FactSet';
    facts: Fact[];
}

interface ActionSet {
    type: 'ActionSet';
    actions: Action[];
}

interface ColumnSet {
    type: 'ColumnSet';
    columns: Column[];
}

interface Column {
    type: 'ColumnSet';
    items: Element[];
}

interface Action {
    type: string;
    title: string;
    url: string;
}
