import pdfplumber
import re
import json

# Path to your PDF
pdf_path = "./data/hymns.pdf"


def extract_text_from_columns(pdf_path):
    """Extract text from two-column PDF."""
    hymns = []
    with pdfplumber.open(pdf_path) as pdf:
        for page in pdf.pages:
            # Extract left and right columns separately
            left, right = page.within_bbox((0, 0, page.width / 2, page.height)).extract_text(), \
                page.within_bbox(
                    (page.width / 2, 0, page.width, page.height)).extract_text()
            hymns.append({"twi": left.strip(), "english": right.strip()})
    return hymns


def parse_hymn_content(text, is_twi=True):
    """Parse hymn content into title, number, and content."""
    lines = text.splitlines()
    title = None
    hymn_number = None
    content = []
    chorus = None
    verse = []
    is_chorus = False
    first_verse_added = False

    for line in lines:
        line = line.strip().replace("э", "ɔ")

        # Extract hymn number (e.g., "SS. 656" or "3.")
        if hymn_number is None and re.match(r'^\d+\.|^S\.?S\.?\s*\.?\d+', line):
            hymn_number = re.match(r'^\d+|^S\.?S\.?\s*\.?\d+', line).group()
            continue

        # Extract title
        normalized_line = line.lower()
        if not title and (line.isupper() or re.search(r'[aeɛioɔu]', normalized_line)) and not re.match(r'^S\.?S\.?\s*\.?\d+', line):
            title = normalized_line
            continue

        # Detect chorus marker
        if re.search(r'chorus|nyeso|nyesoo|nnyeso|nyesoэ|chours', line, re.IGNORECASE):
            is_chorus = True
            chorus = [re.sub(r'CHORUS|nyeso|nyesoo|nnyeso|nyesoэ|chours',
                             '', line, flags=re.IGNORECASE).strip()]
            continue

        # Process chorus lines
        if is_chorus:
            if re.match(r'^\d+\.', line):  # If a new verse starts, end the chorus
                is_chorus = False
                if not first_verse_added and verse:
                    content.append(verse)
                    first_verse_added = True
                content.append(["Nnyesoo" if is_twi else "Chorus"] + chorus)
                # Start the new verse
                verse = [re.sub(r'^\d+\.\s*', '', line).capitalize()]
            else:
                chorus.append(line)
            continue

        # Process verses
        if re.match(r'^\d+\.', line):  # Lines starting with a number followed by a period
            if verse:  # If there's a previous verse, save it
                if not first_verse_added:
                    content.append(verse)
                    first_verse_added = True
                else:
                    content.append(verse)
                verse = []
            line = re.sub(r'^\d+\.\s*', '', line)  # Remove verse number
        verse.append(line.capitalize())

    if verse:
        content.append(verse)  # Add the last verse

    if is_chorus and chorus:
        # Add "Nyeso" or "Chorus" before the actual chorus
        chorus_heading = "Nnyesoo" if is_twi else "Chorus"
        content.append([chorus_heading] + chorus)

    return {"number": hymn_number, "title": title, "content": content}


def parse_hymns_from_columns(hymns):
    """Map parsed content into the specified JSON structure."""
    structured_hymns = []
    hymn_number = 1

    for hymn in hymns:
        twi_data = parse_hymn_content(hymn["twi"], is_twi=True)
        english_data = parse_hymn_content(hymn["english"], is_twi=False)

        structured_hymns.append({
            "number": str(hymn_number),
            "twi": twi_data,
            "english": english_data,
        })
        hymn_number += 1

    return structured_hymns


# Extract text from PDF columns
column_text = extract_text_from_columns(pdf_path)

# Parse the extracted column data into structured hymns
parsed_hymns = parse_hymns_from_columns(column_text)

# Save the parsed hymns to JSON
output_path = "./data/hymnal.json"
with open(output_path, 'w') as json_file:
    json.dump(parsed_hymns, json_file, indent=4, ensure_ascii=False)

print(f"Hymns parsed and saved to {output_path}")
