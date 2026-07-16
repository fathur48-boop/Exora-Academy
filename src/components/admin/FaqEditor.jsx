import { Plus, Trash2 } from "lucide-react";
import { Input, Textarea } from "@/components/ui/Input.jsx";

export default function FaqEditor({ faqs, onChange }) {
  function update(index, field, value) {
    const next = [...faqs];
    next[index] = { ...next[index], [field]: value };
    onChange(next);
  }

  function add() {
    onChange([...faqs, { question: "", answer: "" }]);
  }

  function remove(index) {
    onChange(faqs.filter((_, i) => i !== index));
  }

  return (
    <div className="space-y-4">
      {faqs.map((faq, i) => (
        <div key={i} className="rounded-lg border border-line p-4">
          <div className="mb-3 flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wide text-ink/50">FAQ #{i + 1}</span>
            <button type="button" onClick={() => remove(i)} className="text-ink/40 hover:text-red-600">
              <Trash2 size={14} />
            </button>
          </div>
          <div className="space-y-3">
            <Input
              placeholder="Pertanyaan"
              value={faq.question}
              onChange={(e) => update(i, "question", e.target.value)}
            />
            <Textarea
              placeholder="Jawaban"
              rows={2}
              value={faq.answer}
              onChange={(e) => update(i, "answer", e.target.value)}
            />
          </div>
        </div>
      ))}
      <button type="button" onClick={add} className="flex items-center gap-1.5 text-sm font-medium text-brand hover:underline">
        <Plus size={14} /> Tambah FAQ
      </button>
    </div>
  );
}
